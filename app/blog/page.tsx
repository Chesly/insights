import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Articles",
  description: `All articles on AI, technology, SEO, and South African business from ${siteConfig.shortName}.`,
  alternates: { canonical: `${siteConfig.url}/blog` }
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div>
      <PageHero
        title={siteConfig.pages.blog.title}
        subtitle={siteConfig.pages.blog.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      />

      {/* All Categories — shown before the article grid, full browser width strip
          for consistency with the homepage categories treatment */}
      <section className="w-full bg-categories py-6" aria-label="Browse all categories">
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

      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-[285/200]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="pt-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                  {post.category}
                </span>
                <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
