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
  const { error } = await supabase.from("download_leads").insert({
    download_id: id,
    first_name: firstName.trim().slice(0, 100),
    last_name: lastName.trim().slice(0, 100),
    email: email.trim().slice(0, 200),
    whatsapp: whatsapp.trim().slice(0, 50),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
