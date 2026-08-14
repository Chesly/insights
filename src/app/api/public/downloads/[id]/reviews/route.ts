import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// POST — public review submission. Uses the service-role client rather
// than relying on an anon-key RLS insert policy — this project has
// already had one "looked wired up, silently failed in production"
// incident with that pattern (see /api/contact), so new public-write
// endpoints go straight to the client that's guaranteed to work.
// Reviews land as 'pending' and only ever appear on the site once an
// admin approves them.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: downloadId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const authorName = String(body.name || "").trim();
  const authorEmail = String(body.email || "").trim();
  const rating = Number(body.rating);
  const content = String(body.content || "").trim();

  if (!authorName || !authorEmail || !content) {
    return NextResponse.json({ error: "Name, email and review are required." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(authorEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }
  if (content.length > 3000) {
    return NextResponse.json({ error: "Review is too long." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: download } = await supabase.from("downloads").select("id").eq("id", downloadId).single();
  if (!download) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  const { error } = await supabase.from("download_reviews").insert({
    download_id: downloadId,
    author_name: authorName.slice(0, 100),
    author_email: authorEmail.slice(0, 200),
    rating,
    content,
    status: "pending",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
