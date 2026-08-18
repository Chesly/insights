import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// Lists every profile for the approval queue. Gated to admin/super_admin
// specifically, not just "any logged-in user" — the general /admin/*
// middleware only checks for a session, so without this an approved
// "author" account could otherwise view (and via the PATCH route,
// approve) other accounts.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  const { data: me } = await service.from("profiles").select("role").eq("id", user.id).single();
  if (!me || (me.role !== "admin" && me.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await service
    .from("profiles")
    .select("id, email, first_name, last_name, full_name, phone, avatar_url, role, status, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
