import Link from "next/link";
import type { Metadata } from "next";
import { Search, Mail } from "lucide-react";
import { getPopularCategories, getTrendingPosts } from "@/lib/posts";
import { slugify } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import SmartSuggestions from "@/components/SmartSuggestions";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true }
};

export default async function NotFound() {
  const [categories, trending] = await Promise.all([
    getPopularCategories(6).catch(() => []),
    getTrendingPosts(5).catch(() => []),
  ]);

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      {/* ── Hero ── */}
      <p className="text-sm font-semibold uppercase tracking-wide text-gold">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy dark:text-white sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-navy/60 dark:text-white/60">
        The page may have been moved, renamed, or no longer exists. Let&apos;s help you get back on track.
      </p>

      {/* ── Search ── */}
      <div className="mt-8 w-full max-w-xl">
        <div className="flex items-center gap-2 text-sm text-navy/40 dark:text-white/40 mb-2">
          <Search size={14} />
          <span>Search Insights…</span>
        </div>
        <SearchBar variant="page" />
      </div>

      {/* ── Smart, slug-based suggestions ── */}
      <SmartSuggestions />

      {/* ── Popular categories ── */}
      {categories.length > 0 && (
        <div className="mt-12 w-full max-w-2xl">
          <p className="text-sm font-semibold text-navy/70 dark:text-white/70">Popular Categories</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.category}
                href={`/category/${slugify(c.category)}`}
                className="border border-gold/20 px-4 py-1.5 text-sm text-navy hover:bg-gold/10 dark:text-white"
              >
                {c.category}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Trending articles ── */}
      {trending.length > 0 && (
        <div className="mt-12 w-full max-w-2xl text-left">
          <p className="text-sm font-semibold text-navy/70 dark:text-white/70 text-center">Trending Today</p>
          <ol className="mt-4 divide-y divide-gold/10 border border-gold/10">
            {trending.map((post, i) => (
              <li key={post.slug}>
                <Link
                  href={`/${post.section === "coffee" ? "coffee" : "blog"}/${post.slug}`}
                  className="flex items-center gap-3 p-3 hover:bg-gold/5"
                >
                  <span className="text-lg font-bold text-gold/40 w-6 shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium text-navy dark:text-white line-clamp-1">
                    {post.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Quick links ── */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <Link href="/" className="text-navy/60 hover:text-gold dark:text-white/60">Home</Link>
        <Link href="/blog" className="text-navy/60 hover:text-gold dark:text-white/60">Insights</Link>
        <Link href="/coffee" className="text-navy/60 hover:text-gold dark:text-white/60">Let&apos;s Have Coffee</Link>
        <Link href="/downloads" className="text-navy/60 hover:text-gold dark:text-white/60">Downloads</Link>
        <Link href="/about" className="text-navy/60 hover:text-gold dark:text-white/60">About</Link>
        <Link href="/contact" className="text-navy/60 hover:text-gold dark:text-white/60">Contact</Link>
      </div>

      {/* ── Contact + back ── */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <a href="mailto:hello@chesly.tech" className="flex items-center gap-2 text-sm text-navy/50 hover:text-gold dark:text-white/50">
          <Mail size={14} /> Still can&apos;t find it? hello@chesly.tech
        </a>
        <div className="flex gap-3">
          <Link
            href="/"
            className="bg-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark"
          >
            Go home
          </Link>
          <BackButton />
        </div>
      </div>
    </div>
  );
}
