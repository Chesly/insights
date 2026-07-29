import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import { getAllDownloads, pricing } from "@/lib/downloads";

export const metadata: Metadata = {
  title: siteConfig.pages.downloads.title,
  description: siteConfig.pages.downloads.intro,
  alternates: { canonical: `${siteConfig.url}/downloads` }
};

export const revalidate = 3600;

const FILE_TYPE_ICONS: Record<string, string> = { pdf: "📄", zip: "🗜️", doc: "📝", other: "📦" };

export default async function DownloadsPage() {
  const downloads = await getAllDownloads();

  return (
    <div>
      <PageHero
        title={siteConfig.pages.downloads.title}
        subtitle={siteConfig.pages.downloads.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Business Toolkit" }]}
      />
      <div className="container-page py-12">
        {downloads.length === 0 ? (
          <p className="text-center text-navy/50 dark:text-white/50">
            No downloads published yet — check back soon.
          </p>
        ) : (
          // 3 per row, equal card heights via items-stretch + flex column,
          // with the title/description each reserving fixed space below
          // (line-clamp + min-height) so shorter entries don't leave the
          // row looking uneven.
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((item) => {
              const p = pricing(item);
              return (
              <Link
                key={item.id}
                href={`/downloads/${item.slug}`}
                className="group flex flex-col border border-gold/15 p-6 transition-colors hover:border-gold/40"
              >
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-gold/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                    {FILE_TYPE_ICONS[item.fileType]} {item.fileType}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      p.state === "free"
                        ? "border border-green-200 bg-green-50 text-green-700"
                        : p.state === "sale"
                        ? "border border-red-200 bg-red-50 text-red-700"
                        : "border border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {p.state === "sale" ? (
                      <>
                        On Sale — R{p.price}{" "}
                        <span className="text-navy/30 line-through dark:text-white/30">R{p.compareAtPrice}</span>
                      </>
                    ) : (
                      p.label
                    )}
                  </span>
                </div>

                {/* Image */}
                <div className="mt-3 aspect-video overflow-hidden bg-gold/5">
                  {item.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">📄</div>
                  )}
                </div>

                {/* Name — reserves 3 lines of height regardless of actual length */}
                <h2 className="mt-3 line-clamp-3 min-h-[3.75rem] font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                  {item.name}
                </h2>

                {/* Short description — reserves 5 lines of height */}
                <p className="mt-2 line-clamp-5 min-h-[6.25rem] text-sm leading-relaxed text-navy/60 dark:text-white/60">
                  {item.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold">
                  Read More →
                </span>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
