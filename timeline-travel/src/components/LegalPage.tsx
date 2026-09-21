import { getPageBySlug } from "@/lib/pages";

export async function LegalPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const page = await getPageBySlug(slug);

  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">{page?.title || fallbackTitle}</h1>
      {page?.body ? (
        <div
          className="prose mt-8 max-w-3xl prose-headings:text-[#0F3D3E] prose-a:text-[#D9A62E]"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      ) : (
        <p className="mt-8 max-w-2xl text-sm text-[#0F3D3E]/60">
          This page hasn&apos;t been published in the CMS yet.
        </p>
      )}
    </div>
  );
}
