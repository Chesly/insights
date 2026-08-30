import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getFactBySlug } from "@/lib/facts";
import PageHero from "@/components/lcdkhaya/PageHero";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fact = await getFactBySlug(slug);
  if (!fact) return {};
  return {
    title: { absolute: `${fact.headline} | ${lcdKhayaConfig.shortName}` },
    description: fact.fact_text,
    alternates: { canonical: `${lcdKhayaConfig.url}/facts/${fact.slug}` }
  };
}

export default async function LcdKhayaFactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fact = await getFactBySlug(slug);
  if (!fact) notFound();

  return (
    <div>
      <PageHero
        title={fact.headline}
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Did You Know?", href: "/lcdkhaya/facts" }, { label: fact.headline }]}
      />
      <div className="container-page max-w-2xl py-8">
        <p className="text-lg text-[#1A1A1A]/80">{fact.fact_text}</p>
        {fact.context && <p className="mt-4 text-sm text-[#1A1A1A]/60">{fact.context}</p>}
        {fact.source_name && (
          <p className="mt-6 text-xs text-[#1A1A1A]/40">
            Source: {fact.source_url ? <a href={fact.source_url} className="hover:text-[#B8860B]" target="_blank" rel="noopener noreferrer">{fact.source_name}</a> : fact.source_name}
          </p>
        )}
        {fact.faq?.length > 0 && (
          <div className="mt-10 space-y-4">
            {fact.faq.map((item) => (
              <div key={item.question} className="border-t border-[#B8860B]/15 pt-4">
                <h2 className="font-semibold text-[#1A1A1A]">{item.question}</h2>
                <p className="mt-1 text-sm text-[#1A1A1A]/60">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
