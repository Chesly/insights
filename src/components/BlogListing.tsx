"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";

interface Props {
  posts: Post[];
  initialCount: number;
  perLoad: number;
  hasFeatured: boolean;
  basePath?: string;
}

// Plain, uncluttered grid — no category filter bar. Readers who want to
// browse by category already have dedicated /category/[slug] pages;
// duplicating that as a wall of buttons here was exactly the kind of
// clutter the confirmed design direction asked to remove.
export default function BlogListing({ posts, initialCount, perLoad, basePath = "/insights" }: Props) {
  const [visible, setVisible] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const shown = posts.slice(0, visible);
  const hasMore = visible < posts.length;
  const remaining = posts.length - visible;

  const loadMore = () => {
    setLoading(true);
    // Small delay for perceived smoothness
    setTimeout(() => {
      setVisible(v => v + perLoad);
      setLoading(false);
    }, 300);
  };

  if (posts.length === 0) {
    return (
      <section className="container-page py-10">
        <div className="py-20 text-center">
          <p className="text-navy/40 dark:text-white/30 text-sm">No articles yet — check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      {/* Grid — 3 cols desktop, 2 tablet, 1 mobile, per the confirmed reference layout */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {shown.map((post, i) => (
          <ArticleCard key={post.slug} post={post} priority={i < 3} basePath={basePath} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div ref={loaderRef} className="mt-12 flex flex-col items-center gap-3">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 text-xs text-navy/40 dark:text-white/30">
            <span>Showing {shown.length} of {posts.length} articles</span>
          </div>
          {/* Progress bar */}
          <div className="w-48 h-0.5 bg-navy/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${(shown.length / posts.length) * 100}%` }}
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
      {!hasMore && (
        <div className="mt-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <span className="h-px w-16 bg-gold/20" />
            <span className="text-xs text-navy/30 dark:text-white/20 uppercase tracking-widest">
              All {posts.length} articles loaded
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
