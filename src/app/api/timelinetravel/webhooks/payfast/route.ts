import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { generateSignature, validateWithPayfast } from "@/lib/timelinetravel/payfast";
import { sendEmail } from "@/lib/email";

// Payment VERIFICATION — the only place a booking is ever allowed to
// flip to paid/confirmed. PayFast POSTs here after the buyer completes
// (or cancels) payment; the frontend redirect to /tours/booking-confirmed
// is purely cosmetic and is never trusted on its own (spec section 37).
//
// Three independent checks must all pass before anything is written:
// 1. The signature PayFast sent matches one we compute ourselves.
// 2. PayFast's own server-to-server "validate" endpoint confirms this
//    ITN genuinely came from them (catches a forged POST using a leaked
//    merchant key, which a signature match alone can't).
// 3. The amount PayFast says was paid matches what the booking expects
//    (catches a tampered amount on an otherwise-valid, differently-priced
//    transaction).
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  const data: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key !== "signature") data[key] = value;
  }
  const receivedSignature = params.get("signature") || "";

  const expectedSignature = generateSignature(data, process.env.PAYFAST_PASSPHRASE || undefined);
  if (expectedSignature !== receivedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const validated = await validateWithPayfast(rawBody);
  if (!validated) {
    return NextResponse.json({ error: "PayFast could not validate this notification" }, { status: 400 });
  }

  const bookingReference = data.m_payment_id || data.custom_str1;
  const amountGross = Number(data.amount_gross || 0);

  const supabase = createServiceClient();
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*, tours(title)")
    .eq("booking_reference", bookingReference)
    .maybeSingle();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Idempotent — PayFast may retry ITN delivery.
  if (booking.payment_status === "paid") {
    return NextResponse.json({ success: true });
  }

  if (Math.abs(amountGross - Number(booking.amount)) > 0.01) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  if (data.payment_status !== "COMPLETE") {
    await supabase.from("bookings").update({ payment_status: "failed" }).eq("id", booking.id);
    return NextResponse.json({ success: true });
  }

  await supabase
    .from("bookings")
    .update({
      payment_status: "paid",
      booking_status: "confirmed",
      payment_reference: data.pf_payment_id || null,
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", booking.id);

  const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  await sendEmail({
    to: booking.customer_email,
    from: fromAddress,
    subject: `Booking Confirmed — ${booking.booking_reference}`,
    html: `
      <p>Hi ${booking.customer_name},</p>
      <p>Your booking for <strong>${booking.tours?.title || "your tour"}</strong> is confirmed.</p>
      <p><strong>Booking reference:</strong> ${booking.booking_reference}<br/>
      <strong>Travellers:</strong> ${booking.travellers_count}<br/>
      <strong>Amount paid:</strong> ${booking.currency} ${Number(booking.amount).toLocaleString("en-ZA")}</p>
      <p>Timeline Travel will be in touch with next steps.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
