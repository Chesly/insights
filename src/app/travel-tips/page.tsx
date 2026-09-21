import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { getFeaturedArticles } from "@/lib/timelinetravel/articles";

export const metadata: Metadata = { title: "Travel Tips" };

export default async function TravelTipsPage() {
  if (!IS_TIMELINE_TRAVEL) notFound();

  const articles = await getFeaturedArticles(50);

  return (
    <div className="container-page py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E]">Stories &amp; Guides</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">Travel Tips</h1>

      {articles.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.id} href={`/travel-tips/${a.slug}`} className="group block">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#0F3D3E]/5">
                {a.featuredImage && (
                  <Image src={a.featuredImage} alt={a.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              {a.categoryName && (
                <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-[#D9A62E]">
                  {a.categoryName}
                </span>
              )}
              <h2 className="mt-1 font-bold text-[#0F3D3E] group-hover:text-[#D9A62E]">{a.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-[#0F3D3E]/60">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-dashed border-[#0F3D3E]/20 p-8 text-center text-sm text-[#0F3D3E]/50">
          Articles will appear here once published in the CMS.
        </p>
      )}
    </div>
  );
}
