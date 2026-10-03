export const IMAGEKIT_PUBLIC_ID = "mkvu8hdr5";

export function isOwnedImageKitUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "ik.imagekit.io" &&
      url.pathname.startsWith(`/${IMAGEKIT_PUBLIC_ID}/`);
  } catch {
    return false;
  }
}

export function downloadAssetUrls(payload: Record<string, unknown>): unknown[] {
  const urls: unknown[] = [payload.file_url, payload.thumbnail_url];
  if (Array.isArray(payload.gallery_images)) urls.push(...payload.gallery_images);
  if (Array.isArray(payload.bundle_files)) {
    for (const file of payload.bundle_files) {
      if (file && typeof file === "object" && "url" in file) urls.push((file as { url?: unknown }).url);
    }
  }
  return urls.filter((url) => url != null && url !== "");
}
