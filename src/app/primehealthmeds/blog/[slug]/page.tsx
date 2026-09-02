import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { getPostBySlug } from "@/lib/posts";
import PageHero from "@/components/primehealthmeds/PageHero";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.seoTitle || post.title} | ${cfg.shortName}` },
    description: post.seoDescription || post.description,
  };
}

export default async function PrimeHealthMedsBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <PageHero
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[{ label: "Home", href: "/primehealthmeds" }, { label: "Blog", href: "/primehealthmeds/blog" }, { label: post.title }]}
      />
      <article className="container-page py-10">
        <div className="prose max-w-none prose-headings:text-[#111827] prose-a:text-[#0f766e]" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
