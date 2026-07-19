import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { postId, parentId, name, email, content, website } = body;

  // Honeypot: a field real visitors never see or fill in, but bots
  // reliably do. If it's filled, silently pretend success — never tell
  // a bot its submission was rejected, or it'll adapt.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!postId || !name?.trim() || !email?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (content.length > 3000) {
    return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    parent_id: parentId || null,
    author_name: name.trim().slice(0, 100),
    author_email: email.trim().slice(0, 200),
    content: content.trim(),
    status: "pending",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
