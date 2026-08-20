import Link from "next/link";
import type { Metadata } from "next";
import { getAllFacts } from "@/lib/facts";
import { siteConfig } from "@/lib/siteConfig";
import { getAllSiteSettings } from "@/lib/settings";

// Random selection on every request (not cached like most pages) — the
// pool is meant to grow toward 250+, and showing the same fixed order
// every visit would make repeat visitors see nothing new. getAllFacts()
// itself is still cached, so this doesn't add extra database load, only
// a fresh shuffle per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Did You Know? South African Facts",
  description:
    "True, sourced facts about South Africa and Southern Africa — history, wildlife, business, infrastructure and more.",
  alternates: { canonical: `${siteConfig.url}/facts` },
};

const FACTS_SHOWN = 23;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function FactsIndexPage() {
  const [allFacts, settings] = await Promise.all([getAllFacts(), getAllSiteSettings()]);
  const facts = shuffle(allFacts).slice(0, FACTS_SHOWN);
  const heroImage = settings.facts_hero_image;

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
      </div>
    </div>
  );
}
