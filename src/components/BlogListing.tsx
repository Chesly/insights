import Link from "next/link";
import type { Post } from "@/lib/types";

interface Props {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

// Plain, uncluttered grid — no category filter bar. Readers who want to
// browse by category already have dedicated /category/[slug] pages;
// duplicating that as a wall of buttons here was exactly the kind of
// clutter the confirmed design direction asked to remove.
//
// `posts` is already the current page's slice — sliced server-side by the
// caller — so this renders one page's worth and links to the others by
// real URL (?page=N) rather than revealing more posts via client state.
export default function BlogListing({ posts, currentPage, totalPages, basePath = "/insights" }: Props) {
  if (posts.length === 0) {
    return (
      <section className="container-page py-10">
        <div className="py-20 text-center">
          <p className="text-navy/40 dark:text-white/30 text-sm">No articles yet — check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      {/* Grid — 3 cols desktop, 2 tablet, 1 mobile, per the confirmed reference layout */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {posts.map((post, i) => (
          <ArticleCard key={post.slug} post={post} priority={i < 3} basePath={basePath} />
        ))}
      </div>

      {/* Numbered pagination — Previous / page numbers / Next, each a real
          link to its own crawlable ?page=N URL. */}
      {totalPages > 1 && (
        <nav aria-label="Articles pagination" className="mt-12 flex items-center justify-center gap-2">
          <Link
            href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : basePath}
            aria-disabled={currentPage <= 1}
            className={`px-3 py-2 text-sm font-semibold ${
              currentPage <= 1
                ? "pointer-events-none text-navy/30 dark:text-white/30"
                : "text-navy hover:text-gold dark:text-white"
            }`}
          >
            ← Previous
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={p === 1 ? basePath : `${basePath}?page=${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center text-sm font-semibold ${
                p === currentPage ? "bg-gold text-navy" : "text-navy hover:text-gold dark:text-white"
              }`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`${basePath}?page=${Math.min(currentPage + 1, totalPages)}`}
            aria-disabled={currentPage >= totalPages}
            className={`px-3 py-2 text-sm font-semibold ${
              currentPage >= totalPages
                ? "pointer-events-none text-navy/30 dark:text-white/30"
                : "text-navy hover:text-gold dark:text-white"
            }`}
          >
            Next →
          </Link>
        </nav>
      )}
    </section>
  );
}

// Article card component
function ArticleCard({ post, priority, basePath }: { post: Post; priority: boolean; basePath: string }) {
  const cats = post.categories?.length ? post.categories : [post.category];

  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      aria-label={post.title}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-[285/200]">
        <img
          src={post.image}
          alt={post.title}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Flags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {post.trending && (
            <span className="bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              🔥 Trending
            </span>
          )}
          {post.editorsPick && (
            <span className="bg-navy px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
              ★ Editor's Pick
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 flex flex-col flex-1">
        {/* Multi-category tags */}
        <div className="flex flex-wrap gap-1 mb-1">
          {cats.slice(0, 2).map(cat => (
            <span
              key={cat}
              className="text-[10px] font-bold uppercase tracking-wide text-gold"
            >
              {cat}{cats.indexOf(cat) < Math.min(cats.length, 2) - 1 ? " ·" : ""}
            </span>
          ))}
        </div>

        <h2 className="line-clamp-2 text-sm font-bold leading-snug text-navy group-hover:text-gold transition-colors dark:text-white dark:group-hover:text-gold">
          {post.title}
        </h2>

        <p className="mt-1.5 line-clamp-2 text-xs text-navy/50 dark:text-white/40 leading-relaxed">
          {post.description}
        </p>

        {/* Meta */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-[10px] text-navy/35 dark:text-white/30">
            {new Date(post.publishedDate).toLocaleDateString("en-ZA", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
          <span className="text-[10px] text-navy/35 dark:text-white/30">{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
