import Link from "next/link";
import type { Post } from "@/lib/types";
import { getSeriesPosts } from "@/lib/posts";

export default async function SeriesBanner({ post }: { post: Post }) {
  if (!post.seriesId || !post.seriesName) return null;

  const siblings = await getSeriesPosts(post.seriesId);
  const index = siblings.findIndex((p) => p.slug === post.slug);
  const total = siblings.length;
  const position = post.seriesOrder || index + 1;
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  const icon = post.section === "coffee" ? "☕" : "📰";
  const label = post.section === "coffee" ? "Coffee Series" : "Series";

  const basePath = (p: Post) => (p.section === "coffee" ? "coffee" : "blog");

  return (
    <div className="mx-auto mb-8 max-w-3xl border border-gold/20 bg-gold/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
        {icon} {label}: {post.seriesName}
        {total > 1 && <> — Part {position} of {total}</>}
      </p>

      {(prev || next) && (
        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
          {prev ? (
            <Link href={`/${basePath(prev)}/${prev.slug}`} className="text-navy/70 hover:text-gold dark:text-white/70">
              ← {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/${basePath(next)}/${next.slug}`} className="text-right text-navy/70 hover:text-gold dark:text-white/70">
              {next.title} →
            </Link>
          ) : <span />}
        </div>
      )}
    </div>
  );
}
