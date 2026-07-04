import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";

export default function ArticleRow({
  heading,
  posts
}: {
  heading: string;
  posts: Post[];
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-14" aria-labelledby={`${heading}-heading`}>
      <h2
        id={`${heading}-heading`}
        className="mb-6 text-xl font-bold uppercase tracking-wide text-navy dark:text-white"
      >
        {heading}
      </h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="relative w-full overflow-hidden bg-navy/5 dark:bg-white/5 aspect-[285/200]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                {post.category}
              </span>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
