"use client";

import { useState } from "react";
import Link from "next/link";
import type { Fact } from "@/types";

interface Props {
  facts: Fact[];
  initialCount: number;
  perLoad: number;
}

// Same Load More pattern as BlogListing (the confirmed site-wide listing
// convention — /insights, /coffee and this all behave the same way, and
// future listings like calculators/tools should follow it too), adapted
// to the facts card layout (category tag, headline, excerpt, no image).
export default function FactsListing({ facts, initialCount, perLoad }: Props) {
  const [visible, setVisible] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const shown = facts.slice(0, visible);
  const hasMore = visible < facts.length;
  const remaining = facts.length - visible;

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisible((v) => v + perLoad);
      setLoading(false);
    }, 300);
  };

  if (facts.length === 0) {
    return <p className="text-center text-navy/50 dark:text-white/50">More facts coming soon.</p>;
  }

  return (
    <>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((fact) => (
          <Link key={fact.slug} href={`/facts/${fact.slug}`} className="group block">
            {fact.category && (
              <span className="inline-block bg-gold/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gold">
                {fact.category}
              </span>
            )}
            <h2 className="mt-2 text-base font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
              {fact.headline}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-navy/60 dark:text-white/60">{fact.fact_text}</p>
            <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-gold">
              Find Out More →
            </span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-navy/40 dark:text-white/30">
            <span>Showing {shown.length} of {facts.length} facts</span>
          </div>
          <div className="h-0.5 w-48 overflow-hidden rounded-full bg-navy/10 dark:bg-white/10">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${(shown.length / facts.length) * 100}%` }}
            />
          </div>
          <button
            onClick={loadMore}
            disabled={loading}
            className="mt-2 flex items-center gap-3 border border-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-50"
          >
            {loading ? "Loading…" : (
              <>
                Load {Math.min(perLoad, remaining)} More
                <span className="text-[10px] font-normal opacity-60">({remaining} remaining)</span>
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && facts.length > initialCount && (
        <div className="mt-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gold/20" />
            <span className="text-xs uppercase tracking-widest text-navy/30 dark:text-white/20">
              All {facts.length} facts loaded
            </span>
            <span className="h-px w-16 bg-gold/20" />
          </div>
          <a href="/search" className="inline-flex items-center gap-2 text-xs font-semibold text-gold underline">
            Search all articles →
          </a>
        </div>
      )}
    </>
  );
}
