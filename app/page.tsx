import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getFeaturedPosts,
  getTrendingPosts,
  getEditorsPicks,
  getPopularCategories,
  getPopularTags
} from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import { collectionPageSchema, itemListSchema } from "@/lib/schema";
import SearchBar from "@/components/SearchBar";
import Carousel from "@/components/Carousel";
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
  const latest = posts.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 6);
  const trending = getTrendingPosts(5).filter((p) => !featuredSlugs.has(p.slug));
  const editorsPicks = getEditorsPicks(4);
  const popularCategories = getPopularCategories(8);
  const popularTags = getPopularTags(12);

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

      <div className="container-page py-10 sm:py-14">
        {/* Slim category row */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wide text-gold sm:text-sm">
          {siteConfig.topCategories.map((cat, i) => (
            <span key={cat} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="text-navy/30 dark:text-white/30">•</span>}
              <Link href={`/category/${slugify(cat)}`} className="hover:text-gold-dark">
                {cat}
              </Link>
            </span>
          ))}
        </div>

        {/* Hero heading */}
        <section className="mb-10 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy dark:text-white sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-navy/70 dark:text-white/70">
            {siteConfig.description}
          </p>
          <div className="mx-auto mt-6 flex max-w-md justify-center">
            <SearchBar variant="page" />
          </div>
        </section>

        {/* Featured Stories Carousel */}
        <section className="mb-14" aria-label="Featured stories">
          <Carousel slides={carouselSlides} />
        </section>

        {/* Editor's Note */}
        <section className="mx-auto mb-14 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-gold/15 bg-gold/5 p-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={siteConfig.branding.logo}
              alt={siteConfig.owner.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gold">Editor&rsquo;s Note</p>
            <p className="mt-1 text-navy/80 dark:text-white/80">
              Every week we track the AI, SEO, and technology shifts that actually matter for South
              African founders and marketers — and cut the noise. Thanks for reading.
            </p>
            <p className="mt-2 text-sm font-medium text-navy dark:text-white">
              — {siteConfig.owner.name}, {siteConfig.shortName}
            </p>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section aria-labelledby="latest-heading">
              <div className="mb-6 flex items-center justify-between">
                <h2 id="latest-heading" className="text-2xl font-bold text-navy dark:text-white">
                  Latest Articles
                </h2>
                <Link href="/blog" className="text-sm font-medium text-gold hover:underline">
                  View all &rarr;
                </Link>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {latest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-xl border border-gold/10 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                        {post.category}
                      </span>
                      <h3 className="mt-2 font-semibold text-navy group-hover:text-gold dark:text-white">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-navy/60 dark:text-white/60">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {editorsPicks.length > 0 && (
              <section className="mt-16" aria-labelledby="editors-picks-heading">
                <h2 id="editors-picks-heading" className="mb-6 text-2xl font-bold text-navy dark:text-white">
                  Editor&rsquo;s Picks
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {editorsPicks.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-2xl border border-gold/15 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                          loading="lazy"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold uppercase text-gold">{post.category}</span>
                        <h3 className="mt-1 font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-10" aria-label="Sidebar">
            {trending.length > 0 && (
              <section aria-labelledby="trending-heading">
                <h2 id="trending-heading" className="mb-4 text-lg font-bold text-navy dark:text-white">
                  Trending Now
                </h2>
                <ol className="space-y-4">
                  {trending.map((post, i) => (
                    <li key={post.slug} className="flex gap-3">
                      <span className="text-2xl font-bold text-gold/40">{i + 1}</span>
                      <Link href={`/blog/${post.slug}`} className="group">
                        <p className="text-sm font-medium text-navy group-hover:text-gold dark:text-white">
                          {post.title}
                        </p>
                        <span className="text-xs text-navy/50 dark:text-white/50">{post.category}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {popularCategories.length > 0 && (
              <section aria-labelledby="popular-categories-heading">
                <h2 id="popular-categories-heading" className="mb-4 text-lg font-bold text-navy dark:text-white">
                  Popular Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {popularCategories.map(({ category, count }) => (
                    <Link
                      key={category}
                      href={`/category/${slugify(category)}`}
                      className="rounded-full border border-gold/20 px-3 py-1 text-xs text-navy/70 hover:bg-gold/10 dark:text-white/70"
                    >
                      {category} ({count})
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {popularTags.length > 0 && (
              <section aria-labelledby="popular-tags-heading">
                <h2 id="popular-tags-heading" className="mb-4 text-lg font-bold text-navy dark:text-white">
                  Popular Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(({ tag }) => (
                    <Link
                      key={tag}
                      href={`/tag/${slugify(tag)}`}
                      className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold hover:bg-gold/20"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Compact sidebar newsletter teaser — full detailed signup is the section below */}
            <section
              aria-labelledby="sidebar-newsletter-heading"
              className="rounded-2xl border border-gold/20 bg-gold/5 p-6"
            >
              <h2 id="sidebar-newsletter-heading" className="text-lg font-bold text-navy dark:text-white">
                {siteConfig.newsletter.title}
              </h2>
              <p className="mt-1 text-sm text-navy/60 dark:text-white/60">
                {siteConfig.newsletter.description}
              </p>
              <a
                href="#newsletter"
                className="mt-4 inline-block rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-dark"
              >
                {siteConfig.newsletter.submitLabel}
              </a>
            </section>
          </aside>
        </div>
      </div>

      <div id="newsletter">
        <Newsletter />
      </div>
    </div>
  );
}
