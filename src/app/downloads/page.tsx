import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: siteConfig.pages.downloads.title,
  description: siteConfig.pages.downloads.intro,
  alternates: { canonical: `${siteConfig.url}/downloads` }
};

export default function DownloadsPage() {
  return (
    <div>
      <PageHero
        title={siteConfig.pages.downloads.title}
        subtitle={siteConfig.pages.downloads.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Downloads" }]}
      />
      <div className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.downloads.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between border border-gold/15 p-6"
            >
              <div>
                <span className="inline-block bg-gold/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                  {item.format}
                </span>
                <h2 className="mt-3 font-semibold text-navy dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-navy/60 dark:text-white/60">{item.description}</p>
              </div>
              <span className="mt-6 inline-block border border-navy/20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-navy/50 dark:border-white/20 dark:text-white/50">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
