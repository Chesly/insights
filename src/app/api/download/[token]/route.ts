import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isOwnedImageKitUrl } from "@/lib/imagekit";

export const dynamic = "force-dynamic";

interface BundleFile {
  name?: string;
  url?: string;
  fileType?: string;
}

function safeFilename(value: string, fallback: string) {
  const cleaned = value.normalize("NFKC").replace(/[\\/\r\n\u0000-\u001f\u007f"]/g, "_").trim().slice(0, 160);
  return cleaned || fallback;
}

function addExtension(name: string, fileType?: string, sourceUrl?: string) {
  if (/\.[a-z0-9]{1,8}$/i.test(name)) return name;
  const sourceExt = sourceUrl ? new URL(sourceUrl).pathname.match(/\.([a-z0-9]{1,8})$/i)?.[1] : undefined;
  const extension = sourceExt || ({ xlsx: "xlsx", pdf: "pdf", zip: "zip", doc: "docx", audio: "mp3" } as Record<string, string>)[fileType || ""];
  return extension ? `${name}.${extension}` : name;
}

function expired(req: NextRequest, reason: string) {
  return NextResponse.redirect(new URL(`/download-expired?reason=${reason}`, req.url), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createServiceClient();
  const { data: record } = await supabase
    .from("download_tokens")
    .select("id, use_count, max_uses, expires_at, download:downloads(file_url, file_type, bundle_files, name)")
    .eq("token", token)
    .single();

  if (!record) return expired(req, "invalid");
  if (new Date(record.expires_at) < new Date()) return expired(req, "expired");
  if (record.use_count >= record.max_uses) return expired(req, "used-up");

  const download = record.download as { file_url: string | null; file_type?: string; bundle_files: BundleFile[] | null; name: string } | null;
  if (!download) return expired(req, "invalid");
  const bundleFiles = download.bundle_files || [];
  const requestedFile = new URL(req.url).searchParams.get("file");

  if (bundleFiles.length > 0 && requestedFile === null) {
    return NextResponse.redirect(new URL(`/download/${token}`, req.url), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  let fileUrl: string | null = null;
  let filename: string;
  let fileType: string | undefined;
  if (bundleFiles.length > 0) {
    const index = Number(requestedFile);
    const file = Number.isInteger(index) && index >= 0 ? bundleFiles[index] : undefined;
    if (!file?.url) return expired(req, "invalid");
    fileUrl = file.url;
    filename = file.name || `${download.name}-file-${index + 1}`;
    fileType = file.fileType;
  } else {
    if (requestedFile !== null || !download.file_url) return expired(req, "invalid");
    fileUrl = download.file_url;
    filename = download.name || "download";
    fileType = download.file_type;
  }

  if (!isOwnedImageKitUrl(fileUrl)) {
    return NextResponse.json({ error: "This file is not stored in the approved download library." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  const upstream = await fetch(fileUrl, { cache: "no-store", redirect: "error" }).catch(() => null);
  if (!upstream?.ok || !upstream.body) {
    return NextResponse.json({ error: "The download is temporarily unavailable. Please try again." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  const { data: counted, error: countError } = await supabase
    .from("download_tokens")
    .update({ use_count: record.use_count + 1 })
    .eq("id", record.id)
    .eq("use_count", record.use_count)
    .select("id")
    .maybeSingle();
  if (countError || !counted) return expired(req, "used-up");

  filename = addExtension(safeFilename(filename, "download"), fileType, fileUrl);
  const asciiFallback = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
    "Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
  });
  return new Response(upstream.body, { status: 200, headers });
}
