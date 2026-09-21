import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { getToursByIds } from "@/lib/tours";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
  };
}

export default async function TravelTipArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, relatedTours] = await Promise.all([
    getRelatedArticles(slug),
    getToursByIds(article.relatedTourIds),
  ]);

  return (
    <div className="container-page py-10">
      {article.featuredImage && (
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <Image src={article.featuredImage} alt={article.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">
          {article.categoryName && (
            <span className="inline-block bg-[#D9A62E] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0F3D3E]">
              {article.categoryName}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-extrabold text-[#0F3D3E] sm:text-3xl">{article.title}</h1>

          {article.body && (
            <div
              className="prose mt-6 max-w-none prose-headings:text-[#0F3D3E] prose-a:text-[#D9A62E] prose-strong:text-[#0F3D3E]"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          )}

          {article.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-[#0F3D3E]">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-black/5 border border-black/5">
                {article.faq.map((item, i) => (
                  <details key={i} className="group p-4">
                    <summary className="cursor-pointer list-none font-medium text-[#0F3D3E] marker:content-none">
                      {item.question}
                    </summary>
                    <p className="mt-2 text-sm text-[#0F3D3E]/70">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar — Related Tours, then Related Articles. Same rail
            pattern as Insights' article sidebar, with "Related Products"
            swapped for "Related Tours" since this site sells tours, not
            digital downloads — same content-to-booking funnel the build
            spec asks for (a Kruger article links to Kruger tours). */}
        <aside className="space-y-8 lg:pt-2">
          {relatedTours.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-[#0F3D3E]/50">Related Tours</h2>
              <div className="mt-3 space-y-3">
                {relatedTours.map((t) => (
                  <Link key={t.id} href={`/tours/${t.slug}`} className="group flex gap-3 border border-black/5 p-3">
                    <div className="relative aspect-[68/35] w-20 flex-none overflow-hidden bg-[#0F3D3E]/5">
                      {t.featuredImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.featuredImage} alt={t.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[#0F3D3E] group-hover:text-[#D9A62E]">
                        {t.title}
                      </h3>
                      {t.fromPrice != null && (
                        <p className="mt-1 text-xs font-bold text-[#D9A62E]">
                          From {t.fromCurrency} {t.fromPrice.toLocaleString("en-ZA")}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-[#0F3D3E]/50">Related Articles</h2>
              <div className="mt-3 divide-y divide-black/5 border border-black/5">
                {related.map((r) => (
                  <Link key={r.slug} href={`/travel-tips/${r.slug}`} className="group block p-3">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      {r.featuredImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.featuredImage} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-sm font-semibold leading-snug text-white">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
