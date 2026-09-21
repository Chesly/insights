import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

// Booking CREATION only — deliberately separate from payment initiation/
// verification/confirmation: these must never be collapsed into one
// step, so a failed/abandoned payment can never read as a confirmed
// booking. This route writes a 'pending' row and stops.
function generateReference() {
  return `TT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tourId, priceTierId, travelStartDate, travellersCount, name, email, phone, specialRequirements, notes, amount, currency } = body;

  if (!tourId || !name || !email || !phone || !amount) {
    return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const bookingReference = generateReference();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      booking_reference: bookingReference,
      tour_id: tourId,
      price_tier_id: priceTierId || null,
      travel_start_date: travelStartDate || null,
      travellers_count: travellersCount ? Number(travellersCount) : 1,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      special_requirements: specialRequirements || null,
      notes: notes || null,
      amount: Number(amount),
      currency: currency || "ZAR",
      payment_status: "pending",
      booking_status: "pending",
    })
    .select("booking_reference")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, bookingReference: data.booking_reference });
}
