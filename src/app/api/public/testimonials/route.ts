import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// POST — public testimonial submission, for any client site sharing this
// platform. Uses the service-role client (same reasoning as the other
// public-write routes in this codebase — see /api/contact). Submissions
// land as 'pending' and only appear on the site once an admin approves
// them, so nothing fabricated or spammy ever goes live automatically.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const site = String(body.site || "").trim();
  const authorName = String(body.name || "").trim();
  const authorEmail = String(body.email || "").trim();
  const content = String(body.content || "").trim();
  const rating = body.rating != null ? Number(body.rating) : null;

  if (!site || !authorName || !authorEmail || !content) {
    return NextResponse.json({ error: "Name, email and your testimonial are required." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(authorEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (rating != null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }
  if (content.length > 3000) {
    return NextResponse.json({ error: "Testimonial is too long." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("testimonials").insert({
    site,
    author_name: authorName.slice(0, 100),
    author_email: authorEmail.slice(0, 200),
    rating,
    content,
    status: "pending"
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
