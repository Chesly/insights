import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { collectionPageSchema, itemListSchema, breadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/PageHero";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: slugify(t) }));
}

// Recover the original display casing/spacing for a tag from its slug
// (e.g. "ai-search" -> "AI search"), since URLs are always slugified but
// the label should read naturally.
function getTagLabel(slug: string): string {
  const match = getAllTags().find((t) => slugify(t) === slug);
  return match || slug.replace(/-/g, " ");
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = getTagLabel(slug);
  return {
    title: `#${label}`,
    description: `Articles tagged ${label} on ${siteConfig.shortName}.`,
    alternates: { canonical: `${siteConfig.url}/tag/${slug}` }
  };
}

export default async function TagPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = getTagLabel(slug);
  const posts = getPostsByTag(slug);
  const url = `${siteConfig.url}/tag/${slug}`;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema(`#${label}`, url, `Articles tagged ${label} on ${siteConfig.shortName}.`)
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
              { name: "Articles", url: `${siteConfig.url}/blog` },
              { name: `#${label}`, url }
            ])
          )
        }}
      />

      <PageHero
        title={`#${label}`}
        subtitle={`${posts.length} article${posts.length === 1 ? "" : "s"}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Articles", href: "/blog" },
          { label: `#${label}` }
        ]}
      />

      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden border border-gold/10 shadow-sm hover:shadow-md"
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
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                  {post.category}
                </span>
                <h2 className="mt-2 font-semibold text-navy group-hover:text-gold dark:text-white">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-navy/60 dark:text-white/60">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-navy/50 dark:text-white/50">No articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
