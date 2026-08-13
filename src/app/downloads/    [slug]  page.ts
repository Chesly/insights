
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import DownloadButton from "@/components/DownloadButton";
import { getAllDownloads, getDownloadBySlug, pricing } from "@/lib/downloads";

const FILE_TYPE_ICONS: Record<string, string> = { pdf: "📄", zip: "🗜️", doc: "📝", other: "📦" };

export async function generateStaticParams() {
  const downloads = await getAllDownloads();
  return downloads.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDownloadBySlug(slug);
  if (!item) return {};
  return {
    title: item.seoTitle || `${item.name} | ${siteConfig.pages.downloads.title}`,
    description: item.metaDescription || item.description,
    alternates: { canonical: `${siteConfig.url}/downloads/${item.slug}` },
  };
}

export const revalidate = 3600;

export default async function DownloadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getDownloadBySlug(slug);
  if (!item) notFound();
  const p = pricing(item);

  return (
    <div>
      <PageHero
        title={item.name}
        subtitle={item.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Business Toolkit", href: "/downloads" },
          { label: item.name },
        ]}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        {/* Main content */}
        <div>
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
                  On Sale — R{p.price} <span className="text-navy/30 line-through dark:text-white/30">R{p.compareAtPrice}</span>
                </>
              ) : (
                p.label
              )}
            </span>
            {item.category && (
              <span className="inline-block bg-navy/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy/60 dark:bg-white/10 dark:text-white/60">
                {item.category}
              </span>
            )}
          </div>

          {item.thumbnailUrl && (
            <div className="mt-5 overflow-hidden bg-gold/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumbnailUrl} alt={item.name} className="w-full" />
            </div>
          )}

          {item.description && (
            <p className="mt-6 leading-relaxed text-navy/75 dark:text-white/75">
              {item.description}
            </p>
          )}

          {item.solves.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
                What this solves
              </h2>
              <ul className="mt-3 space-y-2">
                {item.solves.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-navy/75 dark:text-white/75">
                    <span className="text-gold">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.targetAudience.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
                Who it&rsquo;s for
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.targetAudience.map((a) => (
                  <span
                    key={a}
                    className="inline-block border border-navy/10 px-3 py-1 text-xs font-medium text-navy/70 dark:border-white/10 dark:text-white/70"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/downloads"
            className="mt-10 inline-block text-sm font-semibold text-gold hover:underline"
          >
            ← Back to Business Toolkit
          </Link>
        </div>

        {/* Sticky action panel */}
        <aside className="h-fit border border-gold/15 p-6 lg:sticky lg:top-24">
          {p.state !== "free" && (
            <p className="mb-1 text-2xl font-bold text-navy dark:text-white">
              R{p.price ?? "—"}
              {p.state === "sale" && (
                <span className="ml-2 text-base font-normal text-navy/30 line-through dark:text-white/30">
                  R{p.compareAtPrice}
                </span>
              )}
            </p>
          )}
          <p className="text-sm text-navy/60 dark:text-white/60">
            {p.state === "free"
              ? "Free download — no strings attached."
              : p.state === "sale"
              ? "Limited-time price — grab it before it goes back up."
              : "Premium download."}
          </p>
          <DownloadButton
            id={item.id}
            slug={item.slug}
            name={item.name}
            price={p.price}
            thumbnailUrl={item.thumbnailUrl}
            fileUrl={item.fileUrl}
            label={item.tier === "paid" ? "Buy Now" : "Download"}
            tier={item.tier}
            storeUrl={item.storeUrl}
          />
        </aside>
      </div>
    </div>
  );
}
