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
        className="mb-6 text-xl font-bold uppercase tracking-wide text-white"
      >
        {heading}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {posts.slice(0, 5).map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="relative h-[350px] w-full overflow-hidden bg-white/5">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                {post.category}
              </span>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-gold">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
