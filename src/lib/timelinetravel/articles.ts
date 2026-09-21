import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  categoryName: string | null;
  faq: { question: string; answer: string }[];
  relatedTourIds: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    featuredImage: row.featured_image,
    publishedAt: row.published_at,
    categoryName: row.categories?.name ?? null,
    faq: row.faq || [],
    relatedTourIds: row.related_tour_ids || [],
  };
}

const ARTICLE_SELECT = "*, categories(name)";

export const getFeaturedArticles = cache(async (limit = 3): Promise<Article[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(rowToArticle);
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return rowToArticle(data);
});
