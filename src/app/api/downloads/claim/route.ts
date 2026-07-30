import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createDownloadToken, FREE_TOKEN_CONFIG } from "@/lib/downloadTokens";

// POST — used by the "Free" tier download button. Captures just a name +
// email (no WhatsApp/friction — this is a free lead magnet, not a paid
// gate), subscribes them to the newsletter, and issues a secure,
// multi-use token instead of ever exposing the raw file URL.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const downloadId = String(body.downloadId || "");
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();

  if (!downloadId || !name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: download } = await supabase
    .from("downloads")
    .select("id, tier, is_published")
    .eq("id", downloadId)
    .single();
  if (!download || !download.is_published) {
    return NextResponse.json({ error: "This download isn't available." }, { status: 404 });
  }
  // Belt-and-braces: don't let this endpoint be used to bypass payment
  // on a paid item just by guessing its id.
  if (download.tier === "paid") {
    return NextResponse.json({ error: "This is a paid download — please use Buy Now." }, { status: 400 });
  }

  // Subscribe to the newsletter (same table the on-site newsletter form
  // uses) — upsert so re-claiming a download doesn't create duplicates.
  await supabase
    .from("newsletter_subscribers")
    .upsert({ full_name: name, email, source: "free-download" }, { onConflict: "email" });

  const token = await createDownloadToken({
    downloadId,
    email,
    orderId: null,
    ...FREE_TOKEN_CONFIG,
  });

  return NextResponse.json({ downloadUrl: `/api/download/${token}` });
}
