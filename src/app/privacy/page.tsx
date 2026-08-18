import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("privacy");
  return {
    title: page?.seo_title || page?.title || "Privacy Policy",
    description: page?.meta_description,
  };
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("privacy");
  if (!page) notFound();

  return (
    <div className="container-page prose prose-lg mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.body || "" }} />
    </div>
  );
}
