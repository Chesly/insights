import Link from "next/link";
import { getAllDownloads, pricing } from "@/lib/downloads";
import AddToCartButton from "./AddToCartButton";

// Simple, backend-driven product-card row for the bottom of the three
// landing pages (/, /blog, /coffee) — reads live from the same downloads
// table the shop uses, so it's always in sync and never needs manual
// upkeep. First item gets the "highlighted" treatment.
export default async function ProductsTeaser() {
  const downloads = await getAllDownloads();
  const items = downloads.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="border-t border-navy/10 bg-navy/[0.02] py-14 dark:border-white/10 dark:bg-white/[0.02]" aria-labelledby="products-teaser-heading">
      <div className="container-page">
        <div className="mb-8 flex items-center justify-between">
          <h2 id="products-teaser-heading" className="text-xl font-bold uppercase tracking-wide text-navy dark:text-white">
            From the Business Toolkit
          </h2>
          <Link href="/downloads" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const p = pricing(item);
            const highlighted = i === 0;
            return (
              <div
                key={item.id}
                className={`group flex flex-col p-5 ${
                  highlighted
                    ? "bg-gold/10 ring-1 ring-gold/30"
                    : "border border-navy/10 dark:border-white/10"
                }`}
              >
                <Link href={`/downloads/${item.slug}`} className="block">
                  <div className="aspect-video w-full overflow-hidden bg-gold/5">
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
                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy/60 dark:text-white/60">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-gold">
                    {p.state === "sale" ? `On Sale — R${p.price}` : p.label}
                  </p>
                </Link>
                <AddToCartButton item={item} className="mt-3" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
