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
  const latest = remaining.slice(0, 5);
  const popular = getEditorsPicks(5).length > 0 ? getEditorsPicks(5) : remaining.slice(0, 5);
  const trending = getTrendingPosts(5);
  const trendingTitles = getTrendingPosts(3);

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

      {/* Everything from the hero downward shares one dark section colour, full browser width */}
      <div className="bg-section">
        <div className="container-page py-8 sm:py-10">
          {/* Hero heading + category row directly beneath */}
          <section className="mb-8 text-center">
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold sm:text-sm">
              {siteConfig.topCategoryLine}
            </p>
          </section>

          {/* Featured Story + Trending Now */}
          <section className="mb-14 flex flex-col items-stretch gap-[50px] lg:flex-row">
            <div className="min-w-0 flex-1">
              <Carousel slides={carouselSlides} />
            </div>
            {trendingTitles.length > 0 && (
              <aside
                className="flex w-full shrink-0 flex-col justify-between border border-white/10 p-6 lg:w-[350px]"
                aria-label="Trending now"
              >
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
                  Trending Now
                </h2>
                <ol className="flex flex-1 flex-col justify-between gap-4">
                  {trendingTitles.map((post, i) => (
                    <li key={post.slug} className="flex gap-3">
                      <span className="text-xl font-bold text-gold/50">{i + 1}</span>
                      <Link href={`/blog/${post.slug}`} className="group min-w-0">
                        <p className="line-clamp-4 text-sm font-medium leading-snug text-white/85 group-hover:text-gold">
                          {post.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </section>

          {/* Editor's Note — width aligned with the featured image above */}
          <section className="mx-auto mb-14 lg:max-w-[calc(100%-400px)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              Editor&rsquo;s Note
            </p>
            <p className="mt-2 text-base font-light leading-relaxed text-white/70">
              {siteConfig.editorsNote.body}
            </p>
            <p className="mt-2 text-sm text-white/50">— {siteConfig.editorsNote.signature}</p>
          </section>

          {/* Categories — moved above the article listings */}
          <section className="mb-10 flex flex-wrap gap-2" aria-label="Browse categories">
            {siteConfig.categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${slugify(cat)}`}
                className="border border-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70 transition-colors hover:border-gold hover:text-gold"
              >
                {cat}
              </Link>
            ))}
          </section>

          <ArticleRow heading="Latest" posts={latest} />
          <ArticleRow heading="Popular" posts={popular} />
          <ArticleRow heading="Trending" posts={trending} />
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
