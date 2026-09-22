import type { Metadata } from "next";
import { getPostsBySection } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import BlogListing from "@/components/BlogListing";
import ProductsTeaser from "@/components/ProductsTeaser";

// Same page size the "Load More" button used to reveal 12 at a time —
// kept identical so the reading experience (posts per screenful) doesn't
// change, only how the rest get to the browser.
const PAGE_SIZE = 12;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const canonical = page > 1 ? `${siteConfig.url}/insights?page=${page}` : `${siteConfig.url}/insights`;

  return {
    title: "Articles — AI, Websites, Design & Growth",
    description: `Practical insights on AI, websites, SEO, GEO, and South African business growth from ${siteConfig.shortName}.`,
    alternates: { canonical },
    openGraph: {
      title: `Articles | ${siteConfig.shortName}`,
      description: `Practical insights on AI, websites, SEO, and South African business growth.`,
      url: `${siteConfig.url}/insights`,
      type: "website",
    },
  };
}

export const revalidate = 3600;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const posts = await getPostsBySection("insights");

  // One post carries the whole "Featured" slot — the rest is a plain,
  // uncluttered listing below a divider, per the confirmed design. Shown
  // only on page 1: repeating the same featured card on every paginated
  // page would read as duplicate content to search engines and would be
  // repetitive for a reader paging through.
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const pagePosts = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHero
        title={siteConfig.pages.blog.title}
        subtitle={siteConfig.pages.blog.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        backgroundImage="https://ik.imagekit.io/mkvu8hdr5/insights.jpg"
      />

      {featured && page === 1 && (
        <section className="container-page pt-10">
          <FeaturedPost post={featured} />
          <div className="mt-10 h-px bg-gold/20" />
        </section>
      )}

      <BlogListing posts={pagePosts} currentPage={page} totalPages={totalPages} basePath="/insights" />

      <ProductsTeaser />
    </div>
  );
}

// Large, full-width featured card — image left, title/date right — per the
// confirmed "The Blog" reference layout.
function FeaturedPost({ post }: { post: import("@/lib/types").Post }) {
  return (
    <a
      href={`/insights/${post.slug}`}
      className="group grid grid-cols-1 overflow-hidden border border-navy/10 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold dark:border-white/10 md:grid-cols-2"
      aria-label={post.title}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Featured
        </span>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-gold">{post.category}</span>
        <h2 className="mt-2 text-2xl font-bold leading-snug text-navy group-hover:text-gold transition-colors dark:text-white sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy/60 dark:text-white/60">
          {post.description}
        </p>
        <div className="mt-5 flex items-center gap-3 text-xs text-navy/40 dark:text-white/30">
          <span>
            {new Date(post.publishedDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </a>
  );
}
