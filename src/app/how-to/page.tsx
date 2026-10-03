import Link from "next/link";
import type { Metadata } from "next";
import { getPostsByTag } from "@/lib/posts";
import type { Post } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import BlogListing from "@/components/BlogListing";
import ProductsTeaser from "@/components/ProductsTeaser";

export const metadata: Metadata = {
  title: "How-To Guides for South African Businesses",
  description:
    "Clear, practical step-by-step guides for South African suppliers and small businesses, including government supplier registration, tenders and business administration.",
  alternates: { canonical: `${siteConfig.url}/how-to` },
  openGraph: {
    title: `How-To Guides | ${siteConfig.shortName}`,
    description:
      "Step-by-step guidance for South African suppliers and small businesses.",
    url: `${siteConfig.url}/how-to`,
    type: "website",
  },
};

export const revalidate = 3600;

export default async function HowToIndexPage() {
  const posts = await getPostsByTag("How To");
  const featured = posts.find((post) => post.featured) || posts[0];
  const rest = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;

  return (
    <div>
      <PageHero
        title="How To"
        subtitle="Straightforward, step-by-step help for South African suppliers, small businesses and everyday business administration."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "How To" }]}
        backgroundImage="https://ik.imagekit.io/mkvu8hdr5/insights.jpg"
      />

      {posts.length === 0 && (
        <section className="container-page pt-10">
          <div className="border border-gold/20 bg-gold/5 px-6 py-8 text-center">
            <h2 className="text-lg font-bold text-navy dark:text-white">
              Practical guides are on the way
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-navy/60 dark:text-white/60">
              We are preparing clear walkthroughs for supplier registration, eTenders and CSD processes. Published guides will appear here as they are ready.
            </p>
          </div>
        </section>
      )}

      {featured && (
        <section className="container-page pt-10">
          <FeaturedGuide post={featured} />
          <div className="mt-10 h-px bg-gold/20" />
        </section>
      )}

      <BlogListing
        posts={rest}
        initialCount={12}
        perLoad={12}
        hasFeatured={Boolean(featured)}
        basePath="/insights"
      />

      <ProductsTeaser />
    </div>
  );
}

function FeaturedGuide({ post }: { post: Post }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group grid grid-cols-1 overflow-hidden border border-navy/10 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold dark:border-white/10 md:grid-cols-2"
      aria-label={post.title}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy/5 dark:bg-white/5 md:aspect-auto">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Featured How-To
        </span>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-gold">
          {post.category}
        </span>
        <h2 className="mt-2 text-2xl font-bold leading-snug text-navy transition-colors group-hover:text-gold dark:text-white sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy/60 dark:text-white/60">
          {post.description}
        </p>
        <div className="mt-5 flex items-center gap-3 text-xs text-navy/40 dark:text-white/30">
          <span>
            {new Date(post.publishedDate).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
