import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { slugify } from "@/lib/types";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Categories",
  description: `Browse ${siteConfig.shortName} articles by category: AI, technology, SEO, business, and more.`
};

export default function CategoryIndexPage() {
  const posts = getAllPosts();
  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Categories</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {siteConfig.categories.map((cat) => {
          const count = posts.filter((p) => p.category === cat).length;
          return (
            <Link
              key={cat}
              href={`/category/${slugify(cat)}`}
              className="rounded-xl border border-gold/20 p-5 hover:border-gold hover:shadow-md"
            >
              <h2 className="font-semibold text-navy dark:text-white">{cat}</h2>
              <p className="mt-1 text-sm text-navy/50 dark:text-white/50">{count} articles</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
