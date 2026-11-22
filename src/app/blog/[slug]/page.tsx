import { notFound, permanentRedirect } from "next/navigation";
import { getAllPosts } from "@/lib/posts";

function normalise(value: string) {
  return decodeURIComponent(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Resolve historical blog links against current published posts, including changed sections. */
export default async function LegacyBlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getAllPosts(false, ["insights", "coffee", "how-to"]);
  const oldSlug = normalise(slug);
  const targetSlug = oldSlug;
  const post = posts.find((item) => normalise(item.slug) === targetSlug);
  if (post) permanentRedirect(`/${post.section || "insights"}/${post.slug}`);
  notFound();
}
