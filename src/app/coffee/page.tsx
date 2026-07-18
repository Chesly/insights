import type { Metadata } from "next";
import { getPostsBySection } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import BlogListing from "@/components/BlogListing";

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
  const featured = posts.filter((p) => p.featured).slice(0, 3);
  const hasFeatured = featured.length > 0;

  return (
    <div>
      <PageHero
        title="Let's Have ☕"
        subtitle="We don't tell you what to think — we help you think more deeply. Grab a seat and let's talk through the ideas shaping South Africa, business, technology, and society."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Let's Have Coffee" }]}
        backgroundImage="https://ik.imagekit.io/mkvu8hdr5/insights/lets-have-coffee.jpg"
      />

      {posts.length === 0 && (
        <div className="container-page py-16 text-center text-navy/50 dark:text-white/50">
          <p>The first conversation is brewing. Check back soon.</p>
        </div>
      )}

      {hasFeatured && (
        <section className="container-page pt-10 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-gold/20" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              Worth Talking About
            </span>
            <span className="h-px flex-1 bg-gold/20" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((post) => (
              <a
                key={post.slug}
                href={`/coffee/${post.slug}`}
                className="group relative flex flex-col overflow-hidden bg-navy shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                aria-label={post.title}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <span className="absolute top-3 left-3 bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    ☕ Coffee Talk
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold mb-1">
                    {post.category}
                  </span>
                  <h2 className="text-sm font-bold leading-snug text-white line-clamp-2 group-hover:text-gold transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-xs text-white/60 line-clamp-2">{post.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <BlogListing posts={posts} initialCount={12} perLoad={12} hasFeatured={hasFeatured} basePath="/coffee" />
    </div>
  );
}
