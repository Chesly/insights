import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter } from "./types";
import { slugify } from "./types";
import { defaultAuthor } from "./authors";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readPostFile(filename: string): Post {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  // Normalise categories — support both `category` (string) and `categories` (array)
  const primaryCategory = fm.category || (fm.categories && fm.categories[0]) || "Uncategorised";
  const allCategories = fm.categories?.length
    ? fm.categories
    : [primaryCategory];

  return {
    ...fm,
    category: primaryCategory,
    categories: allCategories,
    author: fm.author || defaultAuthor.name,
    authorSlug: fm.authorSlug || defaultAuthor.slug,
    tags: fm.tags || [],
    keywords: fm.keywords || [],
    slug,
    content,
    readingTime: readingTime(content).text
  };
}

// Cached per-request (React `cache`) so multiple components reading posts
// during the same render (header search index, related posts, sitemap,
// RSS) don't each re-hit the filesystem.
export const getAllPosts = cache((includeDrafts = false): Post[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts = files.map(readPostFile);
  return posts
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
});

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(mdxPath)) return readPostFile(`${slug}.mdx`);
  if (fs.existsSync(mdPath)) return readPostFile(`${slug}.md`);
  return null;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) =>
    getPostCategories(p).some(c => slugify(c) === slugify(category))
  );
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.some((t) => slugify(t) === slugify(tag)));
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.featured);
}

/** Returns all categories for a post (multi-category aware) */
export function getPostCategories(post: Post): string[] {
  return post.categories?.length ? post.categories : [post.category];
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  // Score by shared tags + same category, so the most relevant posts (not
  // just the first matches) surface first.
  const scored = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
      const postCats = getPostCategories(post);
      const pCats = getPostCategories(p);
      const sharedCats = pCats.filter(c => postCats.includes(c)).length;
      return { post: p, score: sharedTags * 2 + sharedCats };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  getAllPosts().forEach(p => getPostCategories(p).forEach(c => cats.add(c)));
  return Array.from(cats).sort();
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

export function getPopularTags(limit = 12): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  getAllPosts().forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getPopularCategories(limit = 8): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  getAllPosts().forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getTrendingPosts(limit = 5): Post[] {
  const marked = getAllPosts().filter((p) => p.trending);
  if (marked.length > 0) return marked.slice(0, limit);
  // Fallback: most recent posts, so the section is never empty.
  return getAllPosts().slice(0, limit);
}

export function getEditorsPicks(limit = 4): Post[] {
  const marked = getAllPosts().filter((p) => p.editorsPick);
  if (marked.length > 0) return marked.slice(0, limit);
  return getAllPosts().filter((p) => p.featured).slice(0, limit);
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return getAllPosts().filter((p) => p.authorSlug === authorSlug);
}
