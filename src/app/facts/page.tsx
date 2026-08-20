import Link from "next/link";
import type { Metadata } from "next";
import { getAllFacts } from "@/lib/facts";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Did You Know? South African Facts",
  description:
    "True, sourced facts about South Africa and Southern Africa — history, wildlife, business, infrastructure and more.",
  alternates: { canonical: `${siteConfig.url}/facts` },
};

export default async function FactsIndexPage() {
  const facts = await getAllFacts();

  return (
    <div>
      <div className="bg-gradient-to-br from-navy to-navy-dark">
        <div className="container-page py-14 sm:py-20">
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
