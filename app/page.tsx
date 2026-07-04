import Link from "next/link";
import {
  getAllPosts,
  getFeaturedPosts,
  getTrendingPosts,
  getEditorsPicks
} from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import { collectionPageSchema, itemListSchema } from "@/lib/schema";
import Carousel from "@/components/Carousel";
import ArticleRow from "@/components/ArticleRow";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  const posts = getAllPosts();
  const carouselSource = getFeaturedPosts().length > 0 ? getFeaturedPosts() : posts;
  const carouselSlides = carouselSource.slice(0, 5).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    image: p.image
  }));

  const featuredSlugs = new Set(carouselSlides.map((s) => s.slug));
  const remaining = posts.filter((p) => !featuredSlugs.has(p.slug));

  // Dynamic rows — driven entirely by post metadata, never a hardcoded list.
  const latest = remaining.slice(0, 4);
  const popular = getEditorsPicks(4).length > 0 ? getEditorsPicks(4) : remaining.slice(0, 4);
  const trending = getTrendingPosts(4);
  const trendingTitles = getTrendingPosts(4);

  const listSchema = itemListSchema(
    latest.map((p) => ({ name: p.title, url: `${siteConfig.url}/blog/${p.slug}` }))
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
        <div className="container-page py-8 sm:py-10">
          {/* Small heading + reduced tagline + category line — magazine masthead, not a hero */}
          <section className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {siteConfig.heroKicker}
            </p>
            <h1 className="mx-auto mt-1 max-w-2xl text-2xl font-bold tracking-tight text-navy dark:text-white sm:text-3xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-white/50 sm:text-sm">
              {siteConfig.topCategoryLine}
            </p>
          </section>

          {/* Featured Story + Trending Now */}
          <section className="mb-14 flex flex-col items-stretch gap-5 lg:flex-row">
            <div className="min-w-0 flex-1 lg:max-w-[830px]">
              <Carousel slides={carouselSlides} />
            </div>
            {trendingTitles.length > 0 && (
              <aside
                className="flex w-full shrink-0 flex-col justify-between border border-navy/10 p-6 dark:border-white/10 lg:w-[330px]"
                aria-label="Trending now"
              >
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
                  Trending Now
                </h2>
                <ol className="flex flex-1 flex-col justify-between gap-3">
                  {trendingTitles.map((post, i) => (
                    <li key={post.slug} className="flex gap-3">
                      <span className="text-xl font-bold text-gold/50">{i + 1}</span>
                      <Link href={`/blog/${post.slug}`} className="group min-w-0">
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

        {/* Categories — full browser width strip, distinct from the rest of the page */}
        <section className="w-full bg-categories py-6" aria-label="Browse categories">
          <div className="container-page flex flex-wrap gap-2">
            {siteConfig.categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${slugify(cat)}`}
                className="border border-navy/20 bg-white/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:border-navy hover:bg-white/70"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        <div className="container-page py-10 sm:py-12">
          <ArticleRow heading="Latest" posts={latest} />
          <ArticleRow heading="Popular" posts={popular} />
          <ArticleRow heading="Trending" posts={trending} />

          {/* Editor's Note — relocated below the article listings, styled as a
              standalone editorial aside so it complements rather than interrupts
              the article grid, and leads naturally into the newsletter signup. */}
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
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
