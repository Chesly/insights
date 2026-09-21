import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { buildPaymentFields, PAYFAST_PROCESS_URL } from "@/lib/payfast";
import { siteConfig } from "@/lib/site";

// Payment INITIATION — separate step from booking creation (already
// done by /api/bookings) and from verification (the ITN webhook below).
// Takes an existing pending booking and returns the PayFast form fields
// for the client to auto-submit; never itself marks anything as paid.
export async function POST(req: NextRequest) {
  const { bookingReference } = await req.json();
  if (!bookingReference) {
    return NextResponse.json({ error: "bookingReference is required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, tours(title)")
    .eq("booking_reference", bookingReference)
    .maybeSingle();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.payment_status === "paid") {
    return NextResponse.json({ error: "This booking has already been paid" }, { status: 400 });
  }

  const [firstName, ...rest] = (booking.customer_name || "Guest").split(" ");
  const siteUrl = siteConfig.url;

  const fields = buildPaymentFields({
    bookingReference: booking.booking_reference,
    amount: Number(booking.amount),
    itemName: booking.tours?.title || "Timeline Travel Booking",
    itemDescription: `Booking ${booking.booking_reference} — ${booking.travellers_count} traveller(s)`,
    customerFirstName: firstName || "Guest",
    customerLastName: rest.join(" ") || "-",
    customerEmail: booking.customer_email,
    returnUrl: `${siteUrl}/tours/booking-confirmed?ref=${booking.booking_reference}`,
    cancelUrl: `${siteUrl}/tours/booking-cancelled?ref=${booking.booking_reference}`,
    notifyUrl: `${siteUrl}/api/webhooks/payfast`,
  });

  return NextResponse.json({ processUrl: PAYFAST_PROCESS_URL, fields });
}
