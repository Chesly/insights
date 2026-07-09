import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { searchPosts } from "@/lib/search";
import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "Search",
  description: `Search ${siteConfig.name} articles on AI, technology, SEO, and South African business.`,
  robots: { index: false, follow: true }
};

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? searchPosts(q, 30) : [];

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Search</h1>
      <div className="mt-6 max-w-xl">
        <SearchBar variant="page" />
      </div>

      {q && (
        <p className="mt-6 text-sm text-navy/60 dark:text-white/60">
          {results.length} result{results.length === 1 ? "" : "s"} for{" "}
          <span className="font-semibold text-navy dark:text-white">&ldquo;{q}&rdquo;</span>
        </p>
      )}

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden border border-gold/10 shadow-sm hover:shadow-md"
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
            </div>
          </Link>
        ))}
      </div>

      {q && results.length === 0 && (
        <p className="mt-8 text-navy/50 dark:text-white/50">
          No articles matched &ldquo;{q}&rdquo;. Try a different term or browse{" "}
          <Link href="/category" className="text-gold hover:underline">
            categories
          </Link>
          .
        </p>
      )}
    </div>
  );
}
