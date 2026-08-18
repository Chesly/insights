import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/pages";

// Catch-all for pages created in /admin/pages that don't have their own
// dedicated route file (like /terms or /privacy do). Next.js only falls
// through to this when no more specific static route matches, so it
// can't shadow any existing page.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.seo_title || page.title,
    description: page.meta_description,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="container-page prose prose-lg mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.body || "" }} />
    </div>
  );
}
