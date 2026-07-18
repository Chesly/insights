import type { Metadata } from "next";
import { getPostsBySection } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import PageHero from "@/components/PageHero";
import BlogListing from "@/components/BlogListing";

export const metadata: Metadata = {
  title: "Articles — AI, Websites, Design & Growth",
  description: `Practical insights on AI, websites, SEO, GEO, and South African business growth from ${siteConfig.shortName}.`,
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: `Articles | ${siteConfig.shortName}`,
    description: `Practical insights on AI, websites, SEO, and South African business growth.`,
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const posts = await getPostsBySection("insights");

  // Separate featured from the rest for the hero row
  const featured = posts.filter((p) => p.featured).slice(0, 3);
  const hasFeatured = featured.length > 0;

  // All posts sorted by date (already sorted from getAllPosts)
  return (
    <div>
      <PageHero
        title={siteConfig.pages.blog.title}
        subtitle={siteConfig.pages.blog.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      />

      {/* Category filter strip */}
      <section className="w-full bg-categories py-5" aria-label="Browse by category">
        <div className="container-page flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-navy/40 dark:text-white/30 mr-1 hidden sm:inline">
            Browse:
          </span>
          {siteConfig.categories.map((cat) => (
            <a
              key={cat}
              href={`/category/${slugify(cat)}`}
              className="border border-navy/20 bg-white/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy transition-all hover:border-gold hover:bg-gold hover:text-white dark:border-white/20 dark:bg-white/5 dark:text-white/80 dark:hover:border-gold dark:hover:bg-gold dark:hover:text-white"
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Featured row — only if we have featured posts */}
      {hasFeatured && (
        <section className="container-page pt-10 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-gold/20" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              Featured
            </span>
            <span className="h-px flex-1 bg-gold/20" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((post) => (
              <FeaturedCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Main listing — client component handles load more */}
      <BlogListing posts={posts} initialCount={12} perLoad={12} hasFeatured={hasFeatured} />
    </div>
  );
}

// Server-rendered featured card — rich, larger format
function FeaturedCard({ post }: { post: import("@/lib/types").Post }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden bg-navy shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      aria-label={post.title}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
        {/* Featured badge */}
        <span className="absolute top-3 left-3 bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Featured
        </span>
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gold mb-1">
          {post.category}
        </span>
        <h2 className="text-sm font-bold leading-snug text-white line-clamp-2 group-hover:text-gold transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-xs text-white/60 line-clamp-2">{post.description}</p>
        <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-white/40">
          <span>{new Date(post.publishedDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </a>
  );
}
