import { permanentRedirect, notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";

/**
 * Legacy blog URLs remain entry points only. Content is published once,
 * under its current canonical section. Next.js permanentRedirect uses 308,
 * the permanent, method-preserving equivalent of 301.
 */
export default async function LegacyBlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const candidates = [slug, slug.toLowerCase()];
  for (const candidate of candidates) {
    const post = await getPostBySlug(candidate);
    if (post) permanentRedirect(`/${post.section || "insights"}/${post.slug}`);
  }
  notFound();
}
