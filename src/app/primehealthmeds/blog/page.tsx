import Link from "next/link";
import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { getPostsByTag } from "@/lib/posts";
import PageHero from "@/components/primehealthmeds/PageHero";

export const metadata: Metadata = { title: { absolute: `Blog | ${cfg.shortName}` } };
export const revalidate = 3600;

export default async function PrimeHealthMedsBlogPage() {
  const posts = await getPostsByTag(cfg.blogTag);

  return (
    <div>
      <PageHero title="Health Blog" breadcrumbs={[{ label: "Home", href: "/primehealthmeds" }, { label: "Blog" }]} />
      <div className="container-page py-10">
        {posts.length === 0 ? (
          <p className="text-sm text-[#111827]/50">
            No articles yet — publish a post in the Insights admin tagged &ldquo;{cfg.blogTag}&rdquo; and it will appear here.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/primehealthmeds/blog/${post.slug}`} className="group border border-[#0f766e]/10 bg-white p-5 hover:border-[#0f766e]/30">
                <h2 className="font-semibold text-[#111827] group-hover:text-[#0f766e]">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-[#111827]/60">{post.description}</p>
                <p className="mt-3 text-xs text-[#111827]/40">{post.readingTime}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
