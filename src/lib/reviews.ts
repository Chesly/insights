import { createPublicClient } from "./supabase/public";

export interface PublicReview {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export async function getApprovedReviews(downloadId: string): Promise<PublicReview[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("download_reviews")
    .select("id,author_name,rating,content,created_at")
    .eq("download_id", downloadId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    authorName: r.author_name,
    rating: r.rating,
    content: r.content,
    createdAt: r.created_at,
  }));
}
