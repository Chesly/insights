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
import { siteConfig } from "@/lib/config";
import { slugify } from "@/lib/types";
import { collectionPageSchema, itemListSchema } from "@/lib/schema";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts().slice(0, 1)[0] || posts[0];
  const latest = posts.filter((p) => p.slug !== featured?.slug).slice(0, 6);
  const trending = getTrendingPosts(5).filter((p) => p.slug !== featured?.slug);
  const editorsPicks = getEditorsPicks(4);
  const popularCategories = getPopularCategories(8);
  const popularTags = getPopularTags(12);

  const listSchema = itemListSchema(
    latest.map((p) => ({ name: p.title, url: `${siteConfig.url}/blog/${p.slug}` }))
  );

  return (
    <div className="container-page py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema(siteConfig.name, siteConfig.url, siteConfig.description)
          )
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <section className="mb-10 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy dark:text-white sm:text-5xl">
          AI, Technology &amp; SEO Insights,{" "}
          <span className="text-gold">built from South Africa</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-navy/70 dark:text-white/70">
          {siteConfig.description}
        </p>
        <div className="mx-auto mt-6 flex max-w-md justify-center">
          <SearchBar variant="page" />
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {featured && (
            <section className="mb-16">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-2xl border border-gold/20 shadow-sm transition hover:shadow-lg sm:grid-cols-2"
              >
                <div className="relative aspect-video sm:aspect-auto">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 448px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-8">
                  <span className="mb-3 w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
                    {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold text-navy group-hover:text-gold dark:text-white">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-navy/70 dark:text-white/70">{featured.description}</p>
                  <span className="mt-4 text-sm text-navy/50 dark:text-white/50">
                    {featured.readingTime}
                  </span>
                </div>
              </Link>
            </section>
          )}

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
                  className="group overflow-hidden rounded-xl border border-gold/10 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                      className="object-cover"
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
              <div className="grid gap-6 sm:grid-cols-2">
                {editorsPicks.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="rounded-xl border border-gold/20 p-5 hover:shadow-md"
                  >
                    <span className="text-xs font-semibold uppercase text-gold">{post.category}</span>
                    <h3 className="mt-1 font-semibold text-navy dark:text-white">{post.title}</h3>
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
        </aside>
      </div>

      <section className="mt-20 rounded-2xl bg-navy px-8 py-12 text-center text-white">
        <h2 className="text-2xl font-bold">Get the newsletter</h2>
        <p className="mx-auto mt-2 max-w-md text-white/70">
          Weekly AI, SEO and South African tech insights — straight to your inbox.
        </p>
        <form className="mx-auto mt-6 flex max-w-md gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@email.com"
            className="w-full rounded-full border-none px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-full bg-gold px-6 py-3 font-semibold hover:bg-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
