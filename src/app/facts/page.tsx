import Link from "next/link";
import type { Metadata } from "next";
import { getAllFacts } from "@/lib/facts";
import { siteConfig } from "@/lib/siteConfig";
import { getAllSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Did You Know? South African Facts",
  description:
    "True, sourced facts about South Africa and Southern Africa — history, wildlife, business, infrastructure and more.",
  alternates: { canonical: `${siteConfig.url}/facts` },
};

// A stable, paginated archive of every published fact rather than a
// random subset re-shuffled on each visit — a listing whose contents
// change on every load is bad for search-engine indexing consistency
// (each fact already has its own crawlable /facts/[slug] page; the
// index just needs to reliably surface all of them). 24 divides evenly
// into both the 2-col and 3-col breakpoints below, so the last row
// never looks lopsided.
const PAGE_SIZE = 24;

export default async function FactsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const [allFacts, settings] = await Promise.all([getAllFacts(), getAllSiteSettings()]);
  const heroImage = settings.facts_hero_image;

  const totalPages = Math.max(1, Math.ceil(allFacts.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const facts = allFacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* Full-strength photo with a navy tint on top (not faded into the
          background) — same treatment as the fact detail page hero,
          deliberately kept identical between the two. */}
      <div className="relative overflow-hidden bg-navy">
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy/40" />
          </>
        )}
        <div className="container-page relative py-14 sm:py-20">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Did You Know?</h1>
          <p className="mt-3 max-w-xl text-white/80">
            True, sourced facts about South Africa and Southern Africa — history, wildlife, business and the
            projects shaping the region.
          </p>
        </div>
      </div>

      <div className="container-page py-12">
        {facts.length === 0 ? (
          <p className="text-center text-navy/50 dark:text-white/50">More facts coming soon.</p>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact) => (
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
        )}

        {totalPages > 1 && (
          <nav aria-label="Facts pagination" className="mt-12 flex items-center justify-center gap-2">
            <Link
              href={`/facts${page > 1 ? `?page=${page - 1}` : ""}`}
              aria-disabled={page <= 1}
              className={`px-3 py-2 text-sm font-semibold ${
                page <= 1 ? "pointer-events-none text-navy/30 dark:text-white/30" : "text-navy hover:text-gold dark:text-white"
              }`}
            >
              ← Previous
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? "/facts" : `/facts?page=${p}`}
                className={`flex h-9 w-9 items-center justify-center text-sm font-semibold ${
                  p === page ? "bg-gold text-navy" : "text-navy hover:text-gold dark:text-white"
                }`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/facts?page=${Math.min(page + 1, totalPages)}`}
              aria-disabled={page >= totalPages}
              className={`px-3 py-2 text-sm font-semibold ${
                page >= totalPages ? "pointer-events-none text-navy/30 dark:text-white/30" : "text-navy hover:text-gold dark:text-white"
              }`}
            >
              Next →
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
