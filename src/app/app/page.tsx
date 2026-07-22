import Link from "next/link";
import {
  getAllPosts,
  getFeaturedPosts,
} from "@/lib/posts";
import { getAllDownloads } from "@/lib/downloads";
import { siteConfig } from "@/lib/siteConfig";
import { collectionPageSchema, itemListSchema } from "@/lib/schema";
import Carousel from "@/components/Carousel";
import ArticleRow from "@/components/ArticleRow";
import Newsletter from "@/components/Newsletter";

export const revalidate = 3600;

export default async function HomePage() {
  // Single blended fetch — Insights and Let's Have Coffee together, so the
  // homepage reads like a magazine front page ("what's the next valuable
  // thing to read") rather than two separate silos. Every row below is
  // derived from this one array instead of separate DB calls, keeping the
  // whole homepage consistent and fast.
  const [posts, featuredPosts, downloads] = await Promise.all([
    getAllPosts(false, ["insights", "coffee"]),
    getFeaturedPosts(),
    getAllDownloads(),
  ]);

  const carouselSource = featuredPosts.length > 0 ? featuredPosts : posts;
  const carouselSlides = carouselSource.slice(0, 5).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    image: p.image
  }));

  const featuredSlugs = new Set(carouselSlides.map((s) => s.slug));
  const remaining = posts.filter((p) => !featuredSlugs.has(p.slug));

  // "Most Read" — for now, a placeholder ranking (marked trending, or just
  // the newest) rather than real analytics. This is intentional: once
  // page-view tracking exists, swap this one line for an ORDER BY
  // view_count query — nothing else on the page needs to change.
  const trendingFlagged = remaining.filter((p) => p.trending);
  const mostRead = (trendingFlagged.length > 0 ? trendingFlagged : remaining).slice(0, 4);

  const latest = remaining.slice(0, 4);
  const editorsPickFlagged = remaining.filter((p) => p.editorsPick);
  const popular = (editorsPickFlagged.length > 0 ? editorsPickFlagged : remaining.slice(4, 8));

  const latestDownloads = downloads.slice(0, 4);

  const listSchema = itemListSchema(
    latest.map((p) => ({
      name: p.title,
      url: `${siteConfig.url}/${p.section === "coffee" ? "coffee" : "blog"}/${p.slug}`,
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
          {/* Heading only — no masthead kicker, no descriptive subtext,
              reduced size and spacing so visitors reach real content fast. */}
          <section className="mb-5 text-center">
            <h1 className="mx-auto max-w-2xl text-lg font-bold tracking-tight text-navy dark:text-white sm:text-xl">
              {siteConfig.tagline}
            </h1>
          </section>

          {/* Featured Story + Most Read */}
          <section className="mb-14 flex flex-col items-stretch gap-5 lg:flex-row">
            <div className="min-w-0 flex-1 lg:max-w-[830px]">
              <Carousel slides={carouselSlides} />
            </div>
            {mostRead.length > 0 && (
              <aside
                className="flex w-full shrink-0 flex-col justify-between border border-navy/10 p-6 dark:border-white/10 lg:w-[330px]"
                aria-label="Most read"
              >
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
                  Most Read
                </h2>
                <ol className="flex flex-1 flex-col justify-between gap-3">
                  {mostRead.map((post, i) => (
                    <li key={post.slug} className="flex gap-3">
                      <span className="text-xl font-bold text-gold/50">{i + 1}</span>
                      <Link href={`/${post.section === "coffee" ? "coffee" : "blog"}/${post.slug}`} className="group min-w-0">
                        <p className="line-clamp-4 text-sm font-medium leading-snug text-navy/85 group-hover:text-gold dark:text-white/85">
                          {post.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </section>
        </div>

        <div className="container-page py-10 sm:py-12">
          {/* No "Latest" heading — flows straight from hero into content */}
          <ArticleRow posts={latest} />
          <ArticleRow heading="Popular" posts={popular} />

          {/* Editor's Note */}
          <section className="mx-auto mt-4 max-w-2xl border-t border-navy/10 pt-8 text-center dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              Editor&rsquo;s Note
            </p>
            <p className="mt-2 font-serif text-base italic leading-relaxed text-navy/70 dark:text-white/70">
              {siteConfig.editorsNote.body}
            </p>
            <p className="mt-2 text-sm text-navy/50 dark:text-white/50">
              — {siteConfig.editorsNote.signature}
            </p>
          </section>

          {/* Business Toolkit — bottom of the homepage, same grid as articles */}
          {latestDownloads.length > 0 && (
            <section className="mt-14" aria-labelledby="toolkit-heading">
              <div className="mb-6 flex items-center justify-between">
                <h2 id="toolkit-heading" className="text-xl font-bold uppercase tracking-wide text-navy dark:text-white">
                  Business Toolkit
                </h2>
                <Link href="/downloads" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {latestDownloads.map((item) => (
                  <Link key={item.id} href="/downloads" className="group block">
                    <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-[285/200]">
                      {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl">📄</div>
                      )}
                    </div>
                    <div className="pt-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                        {item.tier === "premium" ? "Premium" : item.tier === "paid" ? "Paid" : "Free"}
                      </span>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                        {item.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
