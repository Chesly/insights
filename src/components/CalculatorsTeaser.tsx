import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

// Home-page teaser for the /calculators hub, styled to match ProductsTeaser
// and placed directly beneath it ("Business Tools" then "Calculators").
// Reads from the same static CALCULATORS registry as the hub page, so a
// new calculator added there shows up here automatically.
export default function CalculatorsTeaser() {
  const items = CALCULATORS.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="border-t border-navy/10 bg-navy/[0.02] py-14 dark:border-white/10 dark:bg-white/[0.02]" aria-labelledby="calculators-teaser-heading">
      <div className="container-page">
        <div className="mb-8 flex items-center justify-between">
          <h2 id="calculators-teaser-heading" className="text-xl font-bold uppercase tracking-wide text-navy dark:text-white">
            Free Calculators
          </h2>
          <Link href="/calculators" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="group flex flex-col border border-navy/10 p-5 dark:border-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gold/10 text-2xl">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  c.icon
                )}
              </div>
              <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                {c.cardTitle}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-navy/60 dark:text-white/60">
                {c.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gold">
                Open Calculator <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
