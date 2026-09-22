import type { Metadata } from "next";
import { getAllFacts } from "@/lib/facts";
import { siteConfig } from "@/lib/siteConfig";
import { getAllSiteSettings } from "@/lib/settings";
import FactsListing from "@/components/FactsListing";

export const metadata: Metadata = {
  title: "Did You Know? South African Facts",
  description:
    "True, sourced facts about South Africa and Southern Africa — history, wildlife, business, infrastructure and more.",
  alternates: { canonical: `${siteConfig.url}/facts` },
};

export default async function FactsIndexPage() {
  const [allFacts, settings] = await Promise.all([getAllFacts(), getAllSiteSettings()]);
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
        <FactsListing facts={allFacts} initialCount={24} perLoad={24} />
      </div>
    </div>
  );
}
