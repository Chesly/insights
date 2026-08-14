import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/download/[token] — the ONLY link ever shown to a shopper.
// Validates the token (exists, not expired, not used up), then either
// redirects straight to the file (single-file products, unchanged
// behaviour) or — for a bundle (multiple files: spreadsheet, how-to PDF,
// audio, etc.) — to /download/[token], a page that lists each file with
// its own download link. The real storage URL is never embedded in any
// page HTML or exposed in the UI ahead of this point, so it can't be
// casually copy-pasted and shared the way a direct file link could.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: record } = await supabase
    .from("download_tokens")
    .select("*, download:downloads(file_url, bundle_files, name, is_published)")
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

  const bundleFiles: unknown[] = record.download?.bundle_files || [];
  const fileUrl = record.download?.file_url;
  if (bundleFiles.length === 0 && !fileUrl) {
    return NextResponse.redirect(new URL("/download-expired?reason=invalid", _req.url));
  }

  await supabase
    .from("download_tokens")
    .update({ use_count: record.use_count + 1 })
    .eq("id", record.id);

  if (bundleFiles.length > 0) {
    return NextResponse.redirect(new URL(`/download/${token}`, _req.url));
  }
  return NextResponse.redirect(fileUrl);
}
