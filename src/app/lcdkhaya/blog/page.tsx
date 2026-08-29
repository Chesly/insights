import Link from "next/link";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getPostsByTag } from "@/lib/posts";
import PageHero from "@/components/lcdkhaya/PageHero";

export const metadata: Metadata = { title: { absolute: `Blog | ${lcdKhayaConfig.shortName}` } };
export const revalidate = 3600;

export default async function LcdKhayaBlogPage() {
  const posts = await getPostsByTag(lcdKhayaConfig.blogTag);

  return (
    <div>
      <PageHero
        title="Blog"
        subtitle="Driving tips, K53 advice and news from LCD Khaya Driving School."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Blog" }]}
      />
      <div className="container-page py-14">
        {posts.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">
            No articles yet — publish a post in the Insights admin panel tagged &ldquo;{lcdKhayaConfig.blogTag}&rdquo; and it will appear here.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/lcdkhaya/blog/${post.slug}`} className="group border border-[#B8860B]/15 bg-white p-5">
                <h2 className="font-semibold text-[#1A1A1A] group-hover:text-[#B8860B]">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-[#1A1A1A]/60">{post.description}</p>
                <p className="mt-3 text-xs text-[#1A1A1A]/40">{post.readingTime}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
