import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { getPostsByCategory } from "@/lib/posts";
import { slugify } from "@/lib/types";
import { collectionPageSchema, itemListSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return siteConfig.categories.map((c) => ({ slug: slugify(c) }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = siteConfig.categories.find((c) => slugify(c) === slug) || slug;
  return {
    title: `${name} Articles`,
    description: `All ${name} articles from ${siteConfig.shortName}.`,
    alternates: { canonical: `${siteConfig.url}/category/${slug}` }
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = siteConfig.categories.find((c) => slugify(c) === slug) || slug;
  const posts = getPostsByCategory(name);
  const url = `${siteConfig.url}/category/${slug}`;

  return (
    <div className="container-page py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema(`${name} Articles`, url, `All ${name} articles from ${siteConfig.shortName}.`)
          )
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(posts.map((p) => ({ name: p.title, url: `${siteConfig.url}/blog/${p.slug}` })))
          )
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: siteConfig.url },
              { name: "Categories", url: `${siteConfig.url}/category` },
              { name, url }
            ])
          )
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-navy/50 dark:text-white/50">
        <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
        <Link href="/category">Categories</Link>
      </nav>

      <h1 className="text-3xl font-bold text-navy dark:text-white">{name}</h1>
      <p className="mt-2 text-navy/60 dark:text-white/60">{posts.length} articles</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-xl border border-gold/10 shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-video">
              <Image
                src={post.image}
                alt={post.title}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="font-semibold text-navy group-hover:text-gold dark:text-white">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-navy/60 dark:text-white/60">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-navy/50 dark:text-white/50">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}
