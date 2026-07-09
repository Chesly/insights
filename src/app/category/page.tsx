import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import { getAllPosts } from "@/lib/posts";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Categories",
  description: `Browse ${siteConfig.shortName} articles by category: AI, technology, SEO, business, and more.`
};

export default function CategoryIndexPage() {
  const posts = getAllPosts();
  return (
    <div>
      <PageHero
        title={siteConfig.pages.category.title}
        subtitle="Browse every topic we cover, from AI to South African business."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />
      <div className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.categories.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            return (
              <Link
                key={cat}
                href={`/category/${slugify(cat)}`}
                className="border border-gold/20 p-5 transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
              >
                <h2 className="font-semibold text-navy dark:text-white">{cat}</h2>
                <p className="mt-1 text-sm text-navy/50 dark:text-white/50">{count} articles</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
