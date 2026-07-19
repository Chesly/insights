import { createPublicClient } from "./supabase/public";

export interface PublicComment {
  id: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
}

export async function getApprovedComments(postId: string): Promise<PublicComment[]> {
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
}
