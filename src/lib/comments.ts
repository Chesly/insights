import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";

export interface PublicComment {
  id: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
}

// Approved comments do not need a database round-trip on every article view.
// Five minutes keeps moderation changes reasonably fresh while absorbing bots.
export const getApprovedComments = unstable_cache(
  async (postId: string): Promise<PublicComment[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("comments")
      .select("id,parent_id,author_name,content,created_at")
      .eq("post_id", postId)
      .eq("status", "approved")
      .order("created_at", { ascending: true });
    if (error || !data) return [];
    return data.map((c) => ({
      id: c.id,
      parentId: c.parent_id,
      authorName: c.author_name,
      content: c.content,
      createdAt: c.created_at,
    }));
  },
  ["public-approved-comments"],
  { revalidate: 300, tags: ["comments"] }
);
