"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { slugify } from "@/lib/types";

interface Props {
  posts: Post[];
  initialCount: number;
  perLoad: number;
  hasFeatured: boolean;
  basePath?: string;
}

export default function BlogListing({ posts, initialCount, perLoad, hasFeatured, basePath = "/blog" }: Props) {
  const [visible, setVisible] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const loaderRef = useRef<HTMLDivElement>(null);

  // Derive unique categories from all posts (multi-category aware)
  const allCategories = ["All", ...Array.from(
    new Set(posts.flatMap(p => p.categories?.length ? p.categories : [p.category]))
  ).sort()];

  // Filter by active category
  const filtered = activeCategory === "All"
    ? posts
    : posts.filter(p => (p.categories?.length ? p.categories : [p.category]).includes(activeCategory));

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const remaining = filtered.length - visible;

  // Reset visible count when category changes
  useEffect(() => { setVisible(initialCount); }, [activeCategory, initialCount]);

  const loadMore = () => {
    setLoading(true);
    // Small delay for perceived smoothness
    setTimeout(() => {
      setVisible(v => v + perLoad);
      setLoading(false);
    }, 300);
  };

  return (
    <section className="container-page py-10">
      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
              activeCategory === cat
                ? "border-gold bg-gold text-white"
                : "border-navy/20 bg-transparent text-navy/60 hover:border-navy hover:text-navy dark:border-white/20 dark:text-white/50 dark:hover:border-white dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
        {activeCategory !== "All" && (
          <span className="ml-auto text-xs text-navy/40 dark:text-white/30">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <span className="h-px flex-1 bg-gold/20" />
        <span className="text-xs font-bold uppercase tracking-widest text-gold">
          {activeCategory === "All" ? "All Insights" : activeCategory}
        </span>
        <span className="h-px flex-1 bg-gold/20" />
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-navy/40 dark:text-white/30 text-sm">No articles in this category yet.</p>
          <button onClick={() => setActiveCategory("All")} className="mt-4 text-gold text-sm font-semibold underline">
            View all articles
          </button>
        </div>
      )}

      {/* Grid — 4 cols desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {shown.map((post, i) => (
          <ArticleCard key={post.slug} post={post} priority={i < 4} basePath={basePath} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div ref={loaderRef} className="mt-12 flex flex-col items-center gap-3">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 text-xs text-navy/40 dark:text-white/30">
            <span>Showing {shown.length} of {filtered.length} articles</span>
          </div>
          {/* Progress bar */}
          <div className="w-48 h-0.5 bg-navy/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${(shown.length / filtered.length) * 100}%` }}
            />
          </div>

          <button
            onClick={loadMore}
            disabled={loading}
            className="mt-2 group flex items-center gap-3 border border-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Loading…
              </>
            ) : (
              <>
                Load {Math.min(perLoad, remaining)} More
                <span className="text-[10px] font-normal opacity-60">
                  ({remaining} remaining)
                </span>
              </>
            )}
          </button>

          {/* Quick jump — appears after 24+ articles shown */}
          {shown.length >= 24 && (
            <p className="text-xs text-navy/30 dark:text-white/20 mt-1">
              Looking for something specific?{" "}
              <a href="/search" className="text-gold underline">Search articles</a>
            </p>
          )}
        </div>
      )}

      {/* End of results */}
      {!hasMore && filtered.length > 0 && (
        <div className="mt-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <span className="h-px w-16 bg-gold/20" />
            <span className="text-xs text-navy/30 dark:text-white/20 uppercase tracking-widest">
              All {filtered.length} articles loaded
            </span>
            <span className="h-px w-16 bg-gold/20" />
          </div>
          <a
            href="/search"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gold underline"
          >
            Search all articles →
          </a>
        </div>
      )}
    </section>
  );
}

// Article card component
function ArticleCard({ post, priority, basePath }: { post: Post; priority: boolean; basePath: string }) {
  const cats = post.categories?.length ? post.categories : [post.category];

  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      aria-label={post.title}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-[285/200]">
        <img
          src={post.image}
          alt={post.title}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Flags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {post.trending && (
            <span className="bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              🔥 Trending
            </span>
          )}
          {post.editorsPick && (
            <span className="bg-navy px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
              ★ Editor's Pick
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 flex flex-col flex-1">
        {/* Multi-category tags */}
        <div className="flex flex-wrap gap-1 mb-1">
          {cats.slice(0, 2).map(cat => (
            <span
              key={cat}
              className="text-[10px] font-bold uppercase tracking-wide text-gold"
            >
              {cat}{cats.indexOf(cat) < Math.min(cats.length, 2) - 1 ? " ·" : ""}
            </span>
          ))}
        </div>

        <h2 className="line-clamp-2 text-sm font-bold leading-snug text-navy group-hover:text-gold transition-colors dark:text-white dark:group-hover:text-gold">
          {post.title}
        </h2>

        <p className="mt-1.5 line-clamp-2 text-xs text-navy/50 dark:text-white/40 leading-relaxed">
          {post.description}
        </p>

        {/* Meta */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-[10px] text-navy/35 dark:text-white/30">
            {new Date(post.publishedDate).toLocaleDateString("en-ZA", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
          <span className="text-[10px] text-navy/35 dark:text-white/30">{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}

function LoadingSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-gold" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
