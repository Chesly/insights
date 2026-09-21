import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Service-role client: anon-key RLS inserts for public-write forms
  // don't reliably pass in production, so validation above is what
  // actually gates this write.
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({
      email,
      full_name: body.full_name || null,
      source: body.source || "timelinetravel-website",
      status: "active",
    }, { onConflict: "email", ignoreDuplicates: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, message: "Subscribed successfully!" });
}
