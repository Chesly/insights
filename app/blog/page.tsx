import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
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
        title="Articles"
        subtitle={`${posts.length} articles on AI, technology, SEO, GEO and South African business.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Articles" }]}
      />
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border border-gold/10 shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-video">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                  {post.category}
                </span>
                <h2 className="mt-2 font-semibold text-navy group-hover:text-gold dark:text-white">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-navy/60 dark:text-white/60">
                  {post.description}
                </p>
                <span className="mt-3 block text-xs text-navy/40 dark:text-white/40">
                  {post.readingTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
