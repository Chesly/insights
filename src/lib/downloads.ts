import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import { slugify } from "./types";

export interface DownloadItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  fileUrl: string;
  fileType: "pdf" | "zip" | "doc" | "other";
  category?: string;
  tier: "free" | "premium" | "paid";
  downloadCount: number;
  targetAudience: string[];
  solves: string[];
  seoTitle?: string;
  metaDescription?: string;
  /** Optional checkout/payment link. When set on a "paid" download, the
      site shows a real "Buy Now" button instead of "Coming Soon". */
  storeUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToDownload(row: any): DownloadItem {
  return {
    id: row.id,
    // Falls back to a name-derived slug if the row predates the slug
    // column/backfill, so nothing 404s while data is still catching up.
    slug: row.slug || slugify(row.name),
    name: row.name,
    subtitle: row.subtitle || "",
    description: row.description || "",
    thumbnailUrl: row.thumbnail_url || "",
    fileUrl: row.file_url,
    fileType: row.file_type || "other",
    category: row.category?.name,
    tier: row.tier === "premium" || row.tier === "paid" ? row.tier : "free",
    downloadCount: row.download_count || 0,
    targetAudience: row.target_audience || [],
    solves: row.solves || [],
    seoTitle: row.seo_title || undefined,
    metaDescription: row.meta_description || undefined,
    storeUrl: row.store_url || undefined,
  };
}

export const getAllDownloads = cache(async (): Promise<DownloadItem[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("downloads")
    .select("*, category:categories(name)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToDownload);
});

export const getDownloadBySlug = cache(async (slug: string): Promise<DownloadItem | null> => {
  const all = await getAllDownloads();
  return all.find((d) => d.slug === slug) || null;
});
