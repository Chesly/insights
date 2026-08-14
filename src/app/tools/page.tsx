import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import { getAllDownloads, pricing } from "@/lib/downloads";

export const metadata: Metadata = {
  title: siteConfig.pages.downloads.title,
  description: siteConfig.pages.downloads.intro,
  alternates: { canonical: `${siteConfig.url}/tools` }
};

export const revalidate = 3600;

export default async function DownloadsPage() {
  const downloads = await getAllDownloads();

  return (
    <div>
      <PageHero
        title={siteConfig.pages.downloads.title}
        subtitle={siteConfig.pages.downloads.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Business Tools" }]}
        backgroundImage="https://ik.imagekit.io/mkvu8hdr5/downloads_page.jpg"
      />
      <div className="container-page py-12">
        {downloads.length === 0 ? (
          <p className="text-center text-navy/50 dark:text-white/50">
            No tools published yet — check back soon.
          </p>
        ) : (
          // Card order is deliberate: title first, then the standardized
          // featured photo (with the price/tier badge overlaid on it, not
          // competing for space above it), then description, then CTA.
          // line-clamp + min-height on title/description keep every card
          // the same height regardless of actual copy length, so a 4-up
          // grid stays uncluttered instead of degrading into a ragged
          // masonry look — see PRODUCT_CARD in ProductsTeaser too if this
          // ever needs to be shared.
          <div className="grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {downloads.map((item) => {
              const p = pricing(item);
              return (
                <Link
                  key={item.id}
                  href={`/tools/${item.slug}`}
                  className="group flex flex-col"
                >
                  {/* Title first */}
                  <h2 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                    {item.name}
                  </h2>

                  {/* Standardized featured photo with the price/tier badge overlaid */}
                  <div className="relative mt-3 aspect-square overflow-hidden bg-gold/5">
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
                    <span
                      className={`absolute left-2 top-2 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        p.state === "free"
                          ? "bg-green-50 text-green-700"
                          : p.state === "sale"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.state === "sale" ? (
                        <>
                          On Sale — R{p.price}{" "}
                          <span className="text-navy/30 line-through">R{p.compareAtPrice}</span>
                        </>
                      ) : (
                        p.label
                      )}
                    </span>
                  </div>

                  {/* Description — no heading label, standardized length */}
                  <p className="mt-3 line-clamp-3 min-h-[4rem] text-sm leading-relaxed text-navy/60 dark:text-white/60">
                    {item.description}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold">
                    View Product <span aria-hidden="true">→</span>
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
