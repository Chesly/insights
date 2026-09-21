import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

// Service-role client — anon-key RLS inserts for public-write forms
// don't reliably pass in production, so validation here (not RLS) is
// what actually gates this.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const message = (body.message || "").trim();

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Name, a valid email, and a message are required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: body.phone || null,
    message,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
