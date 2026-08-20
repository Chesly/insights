import Link from "next/link";
import {
  getAllPosts,
  getFeaturedPosts,
} from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { collectionPageSchema, itemListSchema } from "@/lib/schema";
import Carousel from "@/components/Carousel";
import ArticleRow from "@/components/ArticleRow";
import Newsletter from "@/components/Newsletter";
import ProductsTeaser from "@/components/ProductsTeaser";
import DidYouKnowCard from "@/components/DidYouKnowCard";
import { getTodaysFact } from "@/lib/facts";

export const revalidate = 3600;

export default async function HomePage() {
  // Single blended fetch — Insights and Let's Have Coffee together, so the
  // homepage reads like a magazine front page ("what's the next valuable
  // thing to read") rather than two separate silos. Every row below is
  // derived from this one array instead of separate DB calls, keeping the
  // whole homepage consistent and fast.
  const [posts, featuredPosts, todaysFact] = await Promise.all([
    getAllPosts(false, ["insights", "coffee"]),
    getFeaturedPosts(),
    getTodaysFact(),
  ]);

  const carouselSource = featuredPosts.length > 0 ? featuredPosts : posts;
  const carouselSlides = carouselSource.slice(0, 5).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    image: p.image,
    section: p.section
  }));

  const featuredSlugs = new Set(carouselSlides.map((s) => s.slug));
  const remaining = posts.filter((p) => !featuredSlugs.has(p.slug));

  // "Most Read" — for now, a placeholder ranking (marked trending, or just
  // the newest) rather than real analytics. This is intentional: once
  // page-view tracking exists, swap this one line for an ORDER BY
  // view_count query — nothing else on the page needs to change.
  const trendingFlagged = remaining.filter((p) => p.trending);
  const mostRead = (trendingFlagged.length > 0 ? trendingFlagged : remaining).slice(0, 5);

  const latest = remaining.slice(0, 4);
  const editorsPickFlagged = remaining.filter((p) => p.editorsPick);
  const popular = (editorsPickFlagged.length > 0 ? editorsPickFlagged : remaining.slice(4, 8));

  const listSchema = itemListSchema(
    latest.map((p) => ({
      name: p.title,
      url: `${siteConfig.url}/${p.section === "coffee" ? "coffee" : "insights"}/${p.slug}`,
    }))
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema(siteConfig.name, siteConfig.url, siteConfig.description)
          )
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      {/* White background from the nav down to the Newsletter section */}
      <div className="bg-white dark:bg-navy">
        <div className="container-page py-5 sm:py-6">
          {/* Hero heading — a stronger, more inviting headline than a
              plain tagline restate. Kept compact so it still doesn't
              push real content below the fold. */}
          <section className="mb-5 pt-2 text-center sm:mb-6">
            <h1 className="mx-auto max-w-2xl text-xl font-bold leading-snug tracking-tight text-navy dark:text-white sm:text-2xl lg:max-w-none lg:whitespace-nowrap">
              Practical ideas for building a better business and a better future.
            </h1>
          </section>

          {/* Featured Story + Most Read */}
          <section className="mb-4 flex flex-col items-stretch gap-5 sm:mb-5 lg:flex-row">
            <div className="min-w-0 flex-1 lg:max-w-[830px]">
              <Carousel slides={carouselSlides} />
            </div>
            {mostRead.length > 0 && (
              <aside
                className="flex w-full shrink-0 flex-col overflow-hidden border border-navy/10 dark:border-white/10 lg:w-[330px]"
                aria-label="Most read"
              >
                <h2 className="bg-navy px-5 py-3 text-xs font-bold uppercase tracking-wide text-white dark:bg-white/10">
                  Most Read
                </h2>
                <ol className="flex flex-1 flex-col divide-y divide-navy/10 dark:divide-white/10">
                  {mostRead.map((post, i) => (
                    <li key={post.slug}>
                      <Link
                        href={`/${post.section === "coffee" ? "coffee" : "insights"}/${post.slug}`}
                        className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-gold/5"
                      >
                        <span className="pt-0.5 text-lg font-bold text-gold/60">{i + 1}</span>
                        <p className="line-clamp-3 text-sm font-medium leading-snug text-navy/85 group-hover:text-gold dark:text-white/85">
                          {post.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </section>

          {/* No "Latest" heading — flows straight from hero into content.
              Kept in the same container-page block as the hero/carousel
              above (rather than a second wrapper with its own top padding)
              so the grid below sits close enough to peek above the fold —
              a visual cue that there's more to scroll to. */}
          <ArticleRow posts={latest} extraCard={todaysFact ? <DidYouKnowCard fact={todaysFact} /> : undefined} />
          <ArticleRow heading="Popular" posts={popular} />
        </div>
      </div>

      <ProductsTeaser />

      <Newsletter />
    </div>
  );
}
