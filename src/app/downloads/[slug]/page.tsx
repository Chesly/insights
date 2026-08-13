
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import DownloadButton from "@/components/DownloadButton";
import { getAllDownloads, getDownloadBySlug, getRelatedDownloads, pricing } from "@/lib/downloads";
import { getAllPosts } from "@/lib/posts";

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

  const [relatedProducts, allPosts] = await Promise.all([
    getRelatedDownloads(item),
    getAllPosts(false, ["insights", "coffee"]),
  ]);
  const latestPosts = allPosts.slice(0, 4);

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

      {relatedProducts.length > 0 && (
        <section className="container-page pb-14" aria-labelledby="related-products-heading">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="related-products-heading" className="text-xl font-bold uppercase tracking-wide text-navy dark:text-white">
              Related Products
            </h2>
            <Link href="/downloads" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {relatedProducts.map((rp) => {
              const rpPricing = pricing(rp);
              return (
                <Link key={rp.id} href={`/downloads/${rp.slug}`} className="group block">
                  <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-[285/200]">
                    {rp.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rp.thumbnailUrl}
                        alt={rp.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">📄</div>
                    )}
                  </div>
                  <div className="pt-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                      {rpPricing.label}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                      {rp.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="border-t border-navy/10 bg-navy/[0.02] py-14 dark:border-white/10 dark:bg-white/[0.02]" aria-labelledby="latest-posts-heading">
          <div className="container-page">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="latest-posts-heading" className="text-xl font-bold uppercase tracking-wide text-navy dark:text-white">
                From the Blog
              </h2>
              <Link href="/blog" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.section === "coffee" ? "coffee" : "blog"}/${post.slug}`}
                  className="group block"
                >
                  <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-[285/200]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</span>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
