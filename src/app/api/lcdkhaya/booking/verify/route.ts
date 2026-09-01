import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { fulfillBooking } from "@/lib/lcdkhaya/bookings";

// GET /api/lcdkhaya/booking/verify?reference=xxx — mirrors
// /api/checkout/verify: never trust the redirect alone, re-confirm with
// Paystack before marking a booking confirmed.
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) return NextResponse.json({ error: "Missing reference" }, { status: 400 });

  const supabase = createServiceClient();
  const { data: booking } = await supabase
    .from("lcdkhaya_bookings")
    .select("status")
    .eq("paystack_reference", reference)
    .single();
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  if (booking.status !== "confirmed") {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Payments aren't configured on this site." }, { status: 500 });
    }
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` }
    });
    const paystackJson = await paystackRes.json();
    const success = paystackRes.ok && paystackJson.status && paystackJson.data?.status === "success";
    if (!success) {
      await supabase.from("lcdkhaya_bookings").update({ status: "failed" }).eq("paystack_reference", reference);
      return NextResponse.json({ status: "failed" });
    }
  }

  const result = await fulfillBooking(reference);
  if (result.status === "not_found") {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json(result);
}
