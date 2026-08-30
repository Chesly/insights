import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getPostBySlug } from "@/lib/posts";
import PageHero from "@/components/lcdkhaya/PageHero";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.seoTitle || post.title} | ${lcdKhayaConfig.shortName}` },
    description: post.seoDescription || post.description,
    alternates: { canonical: `${lcdKhayaConfig.url}/blog/${post.slug}` }
  };
}

export default async function LcdKhayaBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <PageHero
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Blog", href: "/lcdkhaya/blog" }, { label: post.title }]}
      />
      <article className="container-page py-8">
        <div
          className="prose max-w-none prose-headings:text-[#1A1A1A] prose-a:text-[#B8860B]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
