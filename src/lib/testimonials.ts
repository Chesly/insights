import { createPublicClient } from "./supabase/public";

export interface PublicTestimonial {
  id: string;
  authorName: string;
  rating: number | null;
  content: string;
  createdAt: string;
}

// Scoped by `site` so any client site sharing this platform's CMS core
// (see supabase-migration-4-testimonials.sql) can pull just its own
// approved testimonials from this one table.
export async function getApprovedTestimonials(site: string): Promise<PublicTestimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id,author_name,rating,content,created_at")
    .eq("site", site)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id,
    authorName: t.author_name,
    rating: t.rating,
    content: t.content,
    createdAt: t.created_at
  }));
}
