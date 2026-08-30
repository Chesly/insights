import Link from "next/link";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getFactsByCategory } from "@/lib/facts";
import PageHero from "@/components/lcdkhaya/PageHero";

export const metadata: Metadata = { title: { absolute: `Did You Know? | ${lcdKhayaConfig.shortName}` } };
export const revalidate = 3600;

export default async function LcdKhayaFactsPage() {
  const facts = await getFactsByCategory(lcdKhayaConfig.factsCategory);

  return (
    <div>
      <PageHero
        title="Did You Know?"
        subtitle="Road safety and K53 facts every Daveyton & Benoni driver should know."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Did You Know?" }]}
      />
      <div className="container-page py-8">
        {facts.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">
            No facts published yet — add one in the Insights admin panel with category &ldquo;{lcdKhayaConfig.factsCategory}&rdquo; and it will appear here.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact) => (
              <Link key={fact.slug} href={`/lcdkhaya/facts/${fact.slug}`} className="group border border-[#B8860B]/15 bg-white p-5">
                <h2 className="font-semibold text-[#1A1A1A] group-hover:text-[#B8860B]">{fact.headline}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-[#1A1A1A]/60">{fact.fact_text}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
