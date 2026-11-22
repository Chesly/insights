import { notFound, permanentRedirect } from "next/navigation";
import { getAllPosts } from "@/lib/posts";

const legacyAliases: Record<string, string> = {
  "national-etender-portal-registration": "how-to-register-on-etender-portal",
  "step-by-step-guide-how-register-import-export": "how-to-register-for-import-and-export-in-south-africa",
};

function normalise(value: string) {
  return decodeURIComponent(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Resolve historical blog links against current published posts, including changed sections. */
export default async function LegacyBlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getAllPosts(false, ["insights", "coffee", "how-to"]);
  const oldSlug = normalise(slug);
  const targetSlug = legacyAliases[oldSlug] || oldSlug;
  const post = posts.find((item) => normalise(item.slug) === targetSlug);
  if (post) permanentRedirect(`/${post.section || "insights"}/${post.slug}`);
  notFound();
}
