import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import DownloadButton from "@/components/DownloadButton";
import { getAllDownloads } from "@/lib/downloads";

export const metadata: Metadata = {
  title: siteConfig.pages.downloads.title,
  description: siteConfig.pages.downloads.intro,
  alternates: { canonical: `${siteConfig.url}/downloads` }
};

export const revalidate = 3600;

const FILE_TYPE_ICONS: Record<string, string> = { pdf: "📄", zip: "🗜️", doc: "📝", other: "📦" };

const TIER_BADGES: Record<string, { label: string; className: string }> = {
  free: { label: "🟢 FREE", className: "bg-green-50 text-green-700 border border-green-200" },
  premium: { label: "🟡 PREMIUM", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  paid: { label: "🔴 PAID", className: "bg-red-50 text-red-700 border border-red-200" },
};

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {downloads.map((item) => {
              const badge = TIER_BADGES[item.tier];
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between border border-gold/15 p-6"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-gold/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                        {FILE_TYPE_ICONS[item.fileType]} {item.fileType}
                      </span>
                      <span className={`inline-block px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h2 className="mt-3 font-semibold text-navy dark:text-white">{item.name}</h2>
                    {item.subtitle && (
                      <p className="mt-0.5 text-xs font-medium text-gold">{item.subtitle}</p>
                    )}
                    {item.thumbnailUrl && (
                      <div className="mt-3 aspect-video overflow-hidden bg-gold/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.thumbnailUrl} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <p className="mt-3 text-sm text-navy/60 dark:text-white/60">{item.description}</p>
                    {item.solves.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {item.solves.slice(0, 4).map((s) => (
                          <li key={s} className="flex items-start gap-1.5 text-xs text-navy/70 dark:text-white/70">
                            <span className="text-gold">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <DownloadButton
                    id={item.id}
                    fileUrl={item.fileUrl}
                    label={item.tier === "premium" ? "Unlock Download" : item.tier === "paid" ? "View Details" : "Download"}
                    tier={item.tier}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
