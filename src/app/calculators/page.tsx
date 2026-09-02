import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import ProductsTeaser from "@/components/ProductsTeaser";
import { CALCULATORS } from "@/lib/calculators";
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/lib/schema";

const PAGE_URL = `${siteConfig.url}/calculators`;

export const metadata: Metadata = {
  title: "Free Business Calculators for South African SMEs",
  description:
    "Free, no-signup calculators built for South African small businesses — tender bid decisions, VAT, and more. Everything runs in your browser; nothing is ever uploaded.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free Business Calculators for South African SMEs",
    description:
      "Free, no-signup calculators built for South African small businesses — tender bid decisions, VAT, and more.",
    url: PAGE_URL,
    type: "website"
  },
  twitter: { card: "summary_large_image" }
};

export default function CalculatorsHubPage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Calculators", url: PAGE_URL }
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema(
              "Free Business Calculators for South African SMEs",
              PAGE_URL,
              "Free, no-signup calculators built for South African small businesses."
            )
          )
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(
              CALCULATORS.map((c) => ({ name: c.title, url: `${siteConfig.url}/calculators/${c.slug}` }))
            )
          )
        }}
      />

      <PageHero
        title="Free Business Calculators"
        subtitle="Quick, practical tools for real South African business decisions. No signup, no upload — everything runs right here in your browser."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calculators" }]}
      />

      <div className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="group flex flex-col border border-navy/10 p-6 transition-colors hover:border-gold dark:border-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-2xl">
                {c.icon}
              </div>
              <h2 className="mt-4 text-lg font-bold text-navy group-hover:text-gold dark:text-white">
                {c.cardTitle}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/60 dark:text-white/60">
                {c.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold">
                Open Calculator <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <ProductsTeaser />
    </div>
  );
}
