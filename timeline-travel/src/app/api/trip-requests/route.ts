import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

// "Plan My Trip" is an enquiry/request workflow, distinct from a tour
// booking — see trip_requests in supabase-schema.sql.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim();

  if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Name, phone, and a valid email are required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("trip_requests").insert({
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    destination: body.destination || null,
    preferred_dates: body.preferredDates || null,
    travellers_count: body.travellersCount ? Number(body.travellersCount) : null,
    travel_type: body.travelType || null,
    budget_range: body.budgetRange || null,
    accommodation_requirements: body.accommodationRequirements || null,
    transport_requirements: body.transportRequirements || null,
    special_requests: body.specialRequests || null,
    notes: body.notes || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
