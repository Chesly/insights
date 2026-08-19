import Link from "next/link";
import type { Post } from "@/lib/types";
import { getSeriesPosts } from "@/lib/posts";

// Renders the "Part of a Series" list at the bottom of an article, right
// before the byline row — but only once a series actually has more than
// one published post in it, since a list of one isn't useful to a reader.
export default async function SeriesBanner({ post }: { post: Post }) {
  if (!post.seriesId) return null;
  const posts = await getSeriesPosts(post.seriesId);
  if (posts.length < 2) return null;

  return (
    <section className="mt-10 border border-gold/20 bg-gold/5 p-6" aria-labelledby="series-heading">
      <h2 id="series-heading" className="text-xs font-bold uppercase tracking-wide text-gold">
        Part of the Series: {post.seriesName}
      </h2>
      <ol className="mt-3 space-y-2">
        {posts.map((p, i) => {
          const current = p.slug === post.slug;
          const href = `/${p.section === "coffee" ? "coffee" : "insights"}/${p.slug}`;
          return (
            <li
              key={p.slug}
              className={`flex items-baseline gap-3 text-sm ${
                current ? "font-semibold text-navy dark:text-white" : "text-navy/70 dark:text-white/70"
              }`}
            >
              <span className="text-gold">{String(i + 1).padStart(2, "0")}</span>
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
  );
}
