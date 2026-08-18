import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("terms");
  return {
    title: page?.seo_title || page?.title || "Terms of Use",
    description: page?.meta_description,
  };
}

export default async function TermsPage() {
  const page = await getPageBySlug("terms");
  if (!page) notFound();

  return (
    <div className="container-page prose prose-lg mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.body || "" }} />
    </div>
  );
}
