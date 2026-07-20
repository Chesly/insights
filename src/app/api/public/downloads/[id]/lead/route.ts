import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { firstName, lastName, email, whatsapp } = body;

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !whatsapp?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const supabase = createPublicClient();
  const { error } = await supabase.rpc("upsert_download_lead", {
    p_download_id: id,
    p_first_name: firstName.trim().slice(0, 100),
    p_last_name: lastName.trim().slice(0, 100),
    p_email: email.trim().toLowerCase().slice(0, 200),
    p_whatsapp: whatsapp.trim().slice(0, 50),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
