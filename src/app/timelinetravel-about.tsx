import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/pages";
import { timelineTravelSiteConfig } from "@/lib/timelinetravel/site";

export async function timelineTravelAboutMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  return {
    title: page?.seo_title || "About Us",
    description: page?.meta_description || timelineTravelSiteConfig.shortDescription,
  };
}

export default async function TimelineTravelAboutPage() {
  const page = await getPageBySlug("about");

  return (
    <div className="container-page py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E]">About Timeline Travel</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">{page?.title || "About Us"}</h1>

      {page?.body ? (
        <div
          className="prose mt-8 max-w-3xl prose-headings:text-[#0F3D3E] prose-a:text-[#D9A62E] prose-strong:text-[#0F3D3E]"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      ) : (
        <p className="mt-8 max-w-2xl text-sm text-[#0F3D3E]/60">
          Content for this page is managed from the CMS and hasn&apos;t been published yet.
        </p>
      )}
    </div>
  );
}
