import { cache } from "react";
import { createPublicClient } from "./supabase/public";

export interface DownloadItem {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  fileUrl: string;
  fileType: "pdf" | "zip" | "doc" | "other";
  category?: string;
  isPremium: boolean;
  downloadCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToDownload(row: any): DownloadItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    thumbnailUrl: row.thumbnail_url || "",
    fileUrl: row.file_url,
    fileType: row.file_type || "other",
    category: row.category?.name,
    isPremium: !!row.is_premium,
    downloadCount: row.download_count || 0,
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
