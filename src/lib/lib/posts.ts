import { cache } from "react";
import readingTime from "reading-time";
import { createPublicClient } from "./supabase/public";
import type { Post } from "./types";
import { slugify } from "./types";
import { defaultAuthor } from "./authors";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

function formatDate(d: string | null): string {
  if (!d) return new Date().toISOString().slice(0, 10);
  return new Date(d).toISOString().slice(0, 10);
}

// Maps a row from the `posts_with_categories` view into the same `Post`
// shape the rest of the site already expects, so page components don't
// need to change beyond adding `await`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(row: any): Post {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: string[] = (row.categories_json || []).map((c: any) => c.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags: string[] = (row.tags_json || []).map((t: any) => t.name);
  const primaryCategory = row.primary_category_name || categories[0] || "Uncategorised";
  const content = row.body || "";

  return {
    id: row.id,
    title: row.title,
    description: row.excerpt || "",
    category: primaryCategory,
    categories: categories.length ? categories : [primaryCategory],
    tags,
    author: row.author_name || defaultAuthor.name,
    authorSlug: row.author_slug || defaultAuthor.slug,
    image: row.featured_image || "",
    publishedDate: formatDate(row.published_at || row.created_at),
    modifiedDate: formatDate(row.updated_at || row.published_at || row.created_at),
    seoTitle: row.seo_title || undefined,
    seoDescription: row.meta_description || undefined,
    keywords: row.keywords || [],
    featured: !!row.featured,
    editorsPick: !!row.popular,
    trending: !!row.trending,
    draft: row.status !== "published",
    allowComments: row.allow_comments !== false,
    seriesId: row.series_id || undefined,
    seriesName: row.series_name || undefined,
    seriesSlug: row.series_slug || undefined,
    seriesOrder: row.series_order || undefined,
    section: row.section === "coffee" ? "coffee" : "insights",

    aiSummary: row.ai_summary || undefined,
    keyTakeaways: row.key_takeaways || undefined,
    faq: row.faq || undefined,
    definitions: row.definitions || undefined,
    expertInsight: row.expert_insight || undefined,
    comparisonTable: row.comparison_table || undefined,
    pros: row.pros || undefined,
    cons: row.cons || undefined,
    relatedTopics: row.related_topics || undefined,
    suggestedQuestions: row.suggested_questions || undefined,
    semanticKeywords: row.semantic_keywords || undefined,
    howToSteps: row.how_to_steps || undefined,

    slug: row.slug,
    content,
    readingTime: readingTime(stripHtml(content)).text,
  };
}

export const getAllPosts = cache(async (
  includeDrafts = false,
  sections: ("insights" | "coffee")[] = ["insights"]
): Promise<Post[]> => {
  const supabase = createPublicClient();
  let query = supabase.from("posts_with_categories").select("*").order("published_at", { ascending: false });
  if (!includeDrafts) query = query.eq("status", "published");
  query = query.in("section", sections);
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(rowToPost);
});

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts_with_categories")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return rowToPost(data);
}

export async function getSeriesPosts(seriesId: string): Promise<Post[]> {
  const posts = await getAllPosts(false, ["insights", "coffee"]);
  return posts
    .filter((p) => p.seriesId === seriesId)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

export async function getPostsBySection(section: "insights" | "coffee"): Promise<Post[]> {
  return getAllPosts(false, [section]);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => getPostCategories(p).some((c) => slugify(c) === slugify(category)));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.some((t) => slugify(t) === slugify(tag)));
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.featured);
}

export function getPostCategories(post: Post): string[] {
  return post.categories?.length ? post.categories : [post.category];
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const all = await getAllPosts();
  const scored = all
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
      const postCats = getPostCategories(post);
      const pCats = getPostCategories(p);
      const sharedCats = pCats.filter((c) => postCats.includes(c)).length;
      return { post: p, score: sharedTags * 2 + sharedCats };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const cats = new Set<string>();
  posts.forEach((p) => getPostCategories(p).forEach((c) => cats.add(c)));
  return Array.from(cats).sort();
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

export async function getPopularTags(limit = 12): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getPopularCategories(limit = 8): Promise<{ category: string; count: number }[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  posts.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  const posts = await getAllPosts();
  const marked = posts.filter((p) => p.trending);
  if (marked.length > 0) return marked.slice(0, limit);
  return posts.slice(0, limit);
}

export async function getEditorsPicks(limit = 4): Promise<Post[]> {
  const posts = await getAllPosts();
  const marked = posts.filter((p) => p.editorsPick);
  if (marked.length > 0) return marked.slice(0, limit);
  return posts.filter((p) => p.featured).slice(0, limit);
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  const posts = await getAllPosts(false, ["insights", "coffee"]);
  return posts.filter((p) => p.authorSlug === authorSlug);
}
