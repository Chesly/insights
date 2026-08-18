import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import PageHero from "@/components/PageHero";
import DownloadButton from "@/components/DownloadButton";
import ProductGallery from "@/components/ProductGallery";
import ProductReviews from "@/components/ProductReviews";
import { getAllDownloads, getDownloadBySlug, getRelatedDownloads, pricing } from "@/lib/downloads";
import { getApprovedReviews } from "@/lib/reviews";
import { getAllPosts } from "@/lib/posts";
import { breadcrumbSchema, productSchema } from "@/lib/schema";

const FILE_TYPE_ICONS: Record<string, string> = { pdf: "📄", zip: "🗜️", doc: "📝", other: "📦" };
const BUNDLE_FILE_ICONS: Record<string, string> = { pdf: "📄", zip: "🗜️", doc: "📝", xlsx: "📊", audio: "🎧", other: "📦" };

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
    alternates: { canonical: `${siteConfig.url}/tools/${item.slug}` },
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

  const [relatedProducts, allPosts, reviews] = await Promise.all([
    getRelatedDownloads(item),
    getAllPosts(false, ["insights", "coffee"]),
    getApprovedReviews(item.id),
  ]);
  const latestPosts = allPosts.slice(0, 4);
  const galleryImages = [item.thumbnailUrl, ...item.galleryImages].filter(Boolean);

  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Business Tools", url: `${siteConfig.url}/tools` },
    { name: item.name, url: `${siteConfig.url}/tools/${item.slug}` },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(item, reviews)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <PageHero
        title={item.name}
        subtitle={item.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Business Tools", href: "/tools" },
          { label: item.name },
        ]}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        {/* Gallery */}
        <div>
          <ProductGallery name={item.name} images={galleryImages} />
        </div>

        {/* Sticky purchase panel */}
        <aside className="h-fit border border-gold/15 p-6 lg:sticky lg:top-24">
          <h1 className="text-xl font-bold text-navy dark:text-white">{item.name}</h1>

          {item.description && (
            <p className="mt-3 text-sm leading-relaxed text-navy/70 dark:text-white/70">
              {item.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-block bg-gold/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
              {FILE_TYPE_ICONS[item.fileType]} {item.fileType}
            </span>
            {item.category && (
              <span className="inline-block bg-navy/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy/60 dark:bg-white/10 dark:text-white/60">
                {item.category}
              </span>
            )}
          </div>

          {p.state !== "free" && (
            <p className="mt-3 text-2xl font-bold text-navy dark:text-white">
              R{p.price ?? "—"}
              {p.state === "sale" && (
                <span className="ml-2 text-base font-normal text-navy/30 line-through dark:text-white/30">
                  R{p.compareAtPrice}
                </span>
              )}
            </p>
          )}
          <p className="mt-1 text-sm text-navy/60 dark:text-white/60">
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

      <div className="container-page pb-4">
        {/* What's Included — only for bundle products (multiple files) */}
        {item.bundleFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
              What&rsquo;s Included
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {item.bundleFiles.map((f, i) => (
                <li key={i} className="flex items-center gap-2 border border-gold/10 px-3 py-2 text-sm text-navy/75 dark:text-white/75">
                  <span aria-hidden="true">{BUNDLE_FILE_ICONS[f.fileType] || "📦"}</span>
                  {f.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Features */}
        {item.keyFeatures.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
              Key Features
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {item.keyFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-navy/75 dark:text-white/75">
                  <span className="text-gold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What This Solves */}
        {item.solves.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
              What This Solves
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

        {/* Who It's For — horizontal flowing point-form, wraps to save space */}
        {item.targetAudience.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
              Who It&rsquo;s For
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
              {item.targetAudience.map((a) => (
                <li key={a} className="text-sm text-navy/75 dark:text-white/75">
                  – {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* How It Helps You */}
        {item.howItHelps.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
              How It Helps You
            </h2>
            <ul className="mt-3 space-y-2">
              {item.howItHelps.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-navy/75 dark:text-white/75">
                  <span className="text-gold">✓</span> {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Why You Need It */}
        {item.whyYouNeedIt.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy dark:text-white">
              Why You Need It
            </h2>
            <ul className="mt-3 space-y-2">
              {item.whyYouNeedIt.map((w) => (
                <li key={w} className="flex items-start gap-2 text-sm text-navy/75 dark:text-white/75">
                  <span className="text-gold">✓</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags — SEO, single product page only */}
        {item.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${slugify(tag)}`}
                className="border border-gold/30 px-3 py-1 text-xs text-navy/70 hover:bg-gold/10 dark:text-white/70"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <ProductReviews downloadId={item.id} reviews={reviews} />

        <Link
          href="/tools"
          className="mt-4 inline-block text-sm font-semibold text-gold hover:underline"
        >
          ← Back to Business Tools
        </Link>
      </div>

      {relatedProducts.length > 0 && (
        <section className="border-t border-navy/10 bg-navy/[0.02] py-14 dark:border-white/10 dark:bg-white/[0.02]" aria-labelledby="related-products-heading">
          <div className="container-page">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="related-products-heading" className="text-xl font-bold uppercase tracking-wide text-navy dark:text-white">
                Related Products
              </h2>
              <Link href="/tools" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {relatedProducts.map((rp) => {
                const rpPricing = pricing(rp);
                return (
                  <div key={rp.id} className="group flex flex-col">
                    <Link href={`/tools/${rp.slug}`} className="block">
                      <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-square">
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
                      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                        {rp.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm font-bold text-gold">{rpPricing.label}</p>
                    <Link
                      href={`/tools/${rp.slug}`}
                      className="mt-3 block border border-gold px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-white"
                    >
                      View Product
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="py-14" aria-labelledby="latest-posts-heading">
          <div className="container-page">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="latest-posts-heading" className="text-xl font-bold uppercase tracking-wide text-navy dark:text-white">
                From the Blog
              </h2>
              <Link href="/insights" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.section === "coffee" ? "coffee" : "insights"}/${post.slug}`}
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
