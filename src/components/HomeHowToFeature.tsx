import Link from "next/link";
import type { Post } from "@/lib/types";

export default function HomeHowToFeature({ posts }: { posts: Post[] }) {
  const guides = posts.slice(0, 4);

  return (
    <section className="mt-10" aria-labelledby="home-how-to-heading">
      <div className="relative isolate overflow-hidden bg-navy">
        <img
          src="/how-to-home-feature.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/35" />
        <div className="max-w-3xl px-6 py-9 sm:px-9 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
            Practical step-by-step guides
          </p>
          <h2
            id="home-how-to-heading"
            className="mt-2 text-2xl font-bold text-white sm:text-3xl"
          >
            How To
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
            Straightforward help for suppliers and small businesses, from getting set up to finding government RFQs.
          </p>
          <Link
            href="/how-to"
            className="mt-5 inline-flex items-center border border-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-gold"
          >
            Explore How To <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {guides.length > 0 ? (
        <div className="grid grid-cols-1 border-x border-b border-navy/10 dark:border-white/10 sm:grid-cols-2">
          {guides.map((post, index) => (
            <Link
              key={post.slug}
              href={`/how-to/${post.slug}`}
              className="group flex gap-3 border-b border-navy/10 p-4 transition-colors hover:bg-gold/5 dark:border-white/10 sm:p-5 [&:nth-child(2n)]:sm:border-l"
            >
              <span className="pt-0.5 text-sm font-bold text-gold/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                  {post.title}
                </span>
                <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-navy/55 dark:text-white/50">
                  {post.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-x border-b border-navy/10 px-5 py-4 text-sm text-navy/60 dark:border-white/10 dark:text-white/55">
          New How To articles are being prepared. Visit the section for the latest guides.
        </div>
      )}
    </section>
  );
}
