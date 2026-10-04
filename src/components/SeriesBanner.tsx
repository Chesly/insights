import Link from "next/link";
import type { Post } from "@/lib/types";
import { getSeriesPosts } from "@/lib/posts";

export default async function SeriesBanner({ post }: { post: Post }) {
  const linkedSeries = post.series?.length
    ? post.series
    : post.seriesId
      ? [{ id: post.seriesId, name: post.seriesName || "Series", slug: post.seriesSlug || "", order: post.seriesOrder }]
      : [];
  if (linkedSeries.length === 0) return null;

  const seriesSections = await Promise.all(
    linkedSeries.map(async (series) => ({
      series,
      posts: await getSeriesPosts(series.id),
    }))
  );
  const visibleSeries = seriesSections.filter(({ posts }) => posts.length > 1);
  if (visibleSeries.length === 0) return null;

  return (
    <div className="mt-10 space-y-5">
      {visibleSeries.map(({ series, posts }) => (
        <section key={series.id} className="border border-gold/20 bg-gold/5 p-6" aria-label={`Series: ${series.name}`}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-gold">
            Part of the Series: {series.name}
          </h2>
          <ol className="mt-3 space-y-2">
            {posts.map((p, i) => {
              const current = p.slug === post.slug;
              const href = `/${p.section || "insights"}/${p.slug}`;
              return (
                <li
                  key={p.slug}
                  className={`flex items-baseline gap-3 text-sm ${
                    current ? "font-semibold text-navy dark:text-white" : "text-navy/70 dark:text-white/70"
                  }`}
                >
                  <span className="text-gold">{String(p.seriesOrder ?? i + 1).padStart(2, "0")}</span>
                  {current ? (
                    <span>
                      {p.title} <span className="text-xs font-normal text-gold">(you are here)</span>
                    </span>
                  ) : (
                    <Link href={href} className="hover:text-gold hover:underline">
                      {p.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
