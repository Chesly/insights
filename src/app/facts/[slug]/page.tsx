import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getFactBySlug, getAllFacts } from "@/lib/facts";
import { siteConfig } from "@/lib/siteConfig";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import FaqAnswer from "@/components/FaqAnswer";
import { getAllSiteSettings } from "@/lib/settings";

export const revalidate = 3600;

export async function generateStaticParams() {
  const facts = await getAllFacts();
  return facts.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fact = await getFactBySlug(slug);
  if (!fact) return {};
  const url = `${siteConfig.url}/facts/${fact.slug}`;
  return {
    title: `${fact.headline} | Did You Know? | ${siteConfig.shortName}`,
    description: fact.fact_text,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: fact.headline, description: fact.fact_text },
  };
}

export default async function FactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [fact, settings] = await Promise.all([getFactBySlug(slug), getAllSiteSettings()]);
  if (!fact) notFound();
  const heroImage = settings.facts_hero_image;

  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Did You Know?", url: `${siteConfig.url}/facts` },
    { name: fact.headline, url: `${siteConfig.url}/facts/${fact.slug}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      {fact.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(fact.faq)) }} />
      )}

      {/* "Fact Hero" — a custom block, not the shared PageHero/breadcrumb
          component used everywhere else on the site. Deliberately bigger
          and richer than the universal breadcrumb band; keep it that way.
          Same site-wide image and treatment as the /facts index hero,
          deliberately kept identical between the two — full-strength
          photo with a navy tint on top, not faded into the background. */}
      <div className="relative overflow-hidden bg-navy">
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy/40" />
          </>
        )}
        <div className="container-page relative py-14 sm:py-20">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/facts" className="hover:text-white">Did You Know?</Link>
          </nav>
          {fact.category && (
            <span className="mt-5 inline-block bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {fact.category}
            </span>
          )}
          <h1 className="mt-4 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            {fact.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{fact.fact_text}</p>
        </div>
      </div>

      <article className="container-page max-w-2xl py-10">
        <div className="prose max-w-none text-navy/80 prose-p:my-3 dark:prose-invert dark:text-white/80">
          <p>{fact.context}</p>
        </div>

        {fact.source_name && (
          <p className="mt-6 border-l-4 border-gold/40 bg-gold/5 px-4 py-3 text-sm text-navy/60 dark:text-white/60">
            Source:{" "}
            {fact.source_url ? (
              <a href={fact.source_url} target="_blank" rel="noopener noreferrer" className="font-medium text-gold hover:underline">
                {fact.source_name}
              </a>
            ) : (
              <span className="font-medium">{fact.source_name}</span>
            )}
          </p>
        )}

        {fact.faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-navy dark:text-white">Frequently Asked Questions</h2>
            <div className="mt-3 divide-y divide-gold/10 border border-gold/20">
              {fact.faq.map((item, i) => (
                <details key={i} className="group p-4">
                  <summary className="cursor-pointer list-none font-medium text-navy marker:content-none dark:text-white">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm text-navy/70 dark:text-white/70">
                    <FaqAnswer text={item.answer} />
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <Link href="/facts" className="mt-10 inline-block text-sm font-semibold text-gold hover:underline">
          ← More Did You Know facts
        </Link>
      </article>
    </div>
  );
}
