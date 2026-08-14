import type { Metadata } from "next";
import { getPostsBySection } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import BlogListing from "@/components/BlogListing";
import ProductsTeaser from "@/components/ProductsTeaser";

export const metadata: Metadata = {
  title: "Let's Have Coffee — Thoughtful Conversations",
  description:
    "Warm, thoughtful conversations about the ideas shaping South Africa, business, technology, and society — no politics, no final answers, just good questions.",
  alternates: { canonical: `${siteConfig.url}/coffee` },
  openGraph: {
    title: `Let's Have Coffee | ${siteConfig.shortName}`,
    description:
      "Thoughtful conversations about the ideas shaping South Africa, business, technology, and society.",
    url: `${siteConfig.url}/coffee`,
    type: "website",
  },
};

export const revalidate = 3600;

export default async function CoffeeIndexPage() {
  const posts = await getPostsBySection("coffee");
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <div>
      <PageHero
        title="Let's Have ☕"
        subtitle="We don't tell you what to think — we help you think more deeply. Grab a seat and let's talk through the ideas shaping South Africa, business, technology, and society."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Let's Have Coffee" }]}
        backgroundImage="https://ik.imagekit.io/mkvu8hdr5/Lets_have_coffee.jpg"
      />

      {posts.length === 0 && (
        <div className="container-page py-16 text-center text-navy/50 dark:text-white/50">
          <p>The first conversation is brewing. Check back soon.</p>
        </div>
      )}

      {featured && (
        <section className="container-page pt-10">
          <FeaturedPost post={featured} />
          <div className="mt-10 h-px bg-gold/20" />
        </section>
      )}

      <BlogListing posts={rest} initialCount={12} perLoad={12} hasFeatured={Boolean(featured)} basePath="/coffee" />

      <ProductsTeaser />
    </div>
  );
}

function FeaturedPost({ post }: { post: import("@/lib/types").Post }) {
  return (
    <a
      href={`/coffee/${post.slug}`}
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
          ☕ Coffee Talk
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
