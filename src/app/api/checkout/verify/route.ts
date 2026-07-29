import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/download/[token] — the ONLY link ever shown to a shopper.
// Validates the token (exists, not expired, not used up), then redirects
// to the actual file. The real storage URL is never embedded in any page
// HTML or exposed in the UI, so it can't be casually copy-pasted and
// shared the way a direct file link could.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: record } = await supabase
    .from("download_tokens")
    .select("*, download:downloads(file_url, name, is_published)")
    .eq("token", token)
    .single();

  if (!record) {
    return NextResponse.redirect(new URL("/download-expired?reason=invalid", _req.url));
  }
  if (new Date(record.expires_at) < new Date()) {
    return NextResponse.redirect(new URL("/download-expired?reason=expired", _req.url));
  }
  if (record.use_count >= record.max_uses) {
    return NextResponse.redirect(new URL("/download-expired?reason=used-up", _req.url));
  }

  const fileUrl = record.download?.file_url;
  if (!fileUrl) {
    return NextResponse.redirect(new URL("/download-expired?reason=invalid", _req.url));
  }

  await supabase
    .from("download_tokens")
    .update({ use_count: record.use_count + 1 })
    .eq("id", record.id);

  return NextResponse.redirect(fileUrl);
}
