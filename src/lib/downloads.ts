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
  /** ZAR selling price, only meaningful when tier is the paid/"Premium" tier. */
  price?: number;
  /** ZAR original price. When set and higher than `price`, the item is
      automatically treated as "On Sale" — no separate tier needed for
      that, it's just a price comparison. */
  compareAtPrice?: number;
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
    price: row.price != null ? Number(row.price) : undefined,
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
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

/** Same-category downloads first (excluding the item itself), padded out
    with the most recent other downloads so the section is never empty. */
export async function getRelatedDownloads(item: DownloadItem, limit = 4): Promise<DownloadItem[]> {
  const all = await getAllDownloads();
  const others = all.filter((d) => d.id !== item.id);
  const sameCategory = item.category ? others.filter((d) => d.category === item.category) : [];
  const rest = others.filter((d) => !sameCategory.includes(d));
  return [...sameCategory, ...rest].slice(0, limit);
}

/** The three states you actually see — Free, On Sale, Premium — derived
    from just two fields (price + compareAtPrice) rather than a third tier
    value. An "On Sale" item IS a Premium item, just discounted right now;
    modelling it as its own tier would let it silently disagree with the
    price (e.g. marked On Sale with no discount set). This can't happen. */
export function pricing(item: Pick<DownloadItem, "tier" | "price" | "compareAtPrice">): {
  state: "free" | "sale" | "premium";
  label: string;
  price?: number;
  compareAtPrice?: number;
} {
  if (item.tier === "free") return { state: "free", label: "Free" };

  const onSale = item.compareAtPrice != null && item.price != null && item.compareAtPrice > item.price;
  if (onSale) {
    return {
      state: "sale",
      label: `On Sale — R${item.price!.toLocaleString("en-ZA")}`,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
    };
  }
  return {
    state: "premium",
    label: item.price != null ? `Premium — R${item.price.toLocaleString("en-ZA")}` : "Premium",
    price: item.price,
  };
}

/** Plain string version for places that just need the label (badges etc). */
export function tierLabel(item: Pick<DownloadItem, "tier" | "price" | "compareAtPrice">): string {
  return pricing(item).label;
}
