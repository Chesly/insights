import type { Post } from "./types";
import { getAllPosts } from "./posts";

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  score: number;
}

/**
 * Lightweight relevance-ranked search across title, description, content,
 * tags, and category. No external index/service required — fine for a
 * publication of this size. Swap for a hosted index (Algolia, Meilisearch)
 * if the article count grows into the thousands.
 */
export async function searchPosts(query: string, limit = 20): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const posts = await getAllPosts();

  const scored = posts
    .map((post) => ({ post, score: scorePost(post, terms) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ post, score }) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    image: post.image,
    score
  }));
}

function scorePost(post: Post, terms: string[]): number {
  const title = post.title.toLowerCase();
  const description = post.description.toLowerCase();
  const content = post.content.toLowerCase();
  const category = post.category.toLowerCase();
  const tags = post.tags.map((t) => t.toLowerCase());
  const keywords = (post.keywords || []).map((k) => k.toLowerCase());

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 5;
    if (category.includes(term)) score += 3;
    if (tags.some((t) => t.includes(term))) score += 3;
    if (keywords.some((k) => k.includes(term))) score += 2;
    if (description.includes(term)) score += 2;
    if (content.includes(term)) score += 1;
  }
  return score;
}
