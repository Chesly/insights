import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getPostsByTag } from "@/lib/posts";
import { getAllSiteSettings } from "@/lib/settings";
import PageHero from "@/components/PageHero";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getAllSiteSettings();
  return {
    title: s.spaza_hero_title || siteConfig.pages.spazaSupport.title,
    description: s.spaza_hero_subtitle || siteConfig.pages.spazaSupport.intro,
    alternates: { canonical: `${siteConfig.url}/spaza-support` }
  };
}

export const revalidate = 3600;

export default async function SpazaSupportPage() {
  const [relatedPosts, s] = await Promise.all([
    getPostsByTag("township economy"),
    getAllSiteSettings(),
  ]);

  return (
    <div>
      <PageHero
        title={s.spaza_hero_title || siteConfig.pages.spazaSupport.title}
        subtitle={s.spaza_hero_subtitle || siteConfig.pages.spazaSupport.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Spaza Support" }]}
      />

      <div className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="border border-gold/15 p-6">
            <h2 className="font-semibold text-navy dark:text-white">{s.spaza_card1_heading || "Business Basics"}</h2>
            <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
              {s.spaza_card1_text || "Pricing, stock management, and record-keeping guidance built for township retail."}
            </p>
          </div>
          <div className="border border-gold/15 p-6">
            <h2 className="font-semibold text-navy dark:text-white">{s.spaza_card2_heading || "AI Tools for Retail"}</h2>
            <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
              {s.spaza_card2_text || "Simple AI tools to help with stock forecasting, customer service, and marketing."}
            </p>
          </div>
          <div className="border border-gold/15 p-6">
            <h2 className="font-semibold text-navy dark:text-white">{s.spaza_card3_heading || "Growth & Funding"}</h2>
            <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
              {s.spaza_card3_text || "Understanding grants, supplier deals, and paths to expand beyond one store."}
            </p>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-navy dark:text-white">Related Reading</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  className="border border-gold/10 p-5 hover:shadow-md"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {post.category}
                  </span>
                  <h3 className="mt-2 font-semibold text-navy dark:text-white">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-navy/60 dark:text-white/60">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
