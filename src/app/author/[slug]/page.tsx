import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { getAuthorBySlug, getAllAuthors } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/posts";
import { personSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const authors = await getAllAuthors();
  const author = authors.find((a) => a.slug === slug);
  if (!author) return {};
  return {
    title: author.name,
    description: `${author.name} — ${author.role} at ${siteConfig.shortName}. ${author.bio}`,
    alternates: { canonical: `${siteConfig.url}/author/${author.slug}` }
  };
}

const SOCIAL_LABELS: Record<string, string> = {
  website: "Website",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  github: "GitHub",
  twitter: "X / Twitter",
};

export default async function AuthorPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const authors = await getAllAuthors();
  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();

  const posts = await getPostsByAuthor(author.slug);
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Authors", url: `${siteConfig.url}/author` },
    { name: author.name, url: `${siteConfig.url}/author/${author.slug}` }
  ]);

  // Stats — all computed live from real content, nothing manually maintained.
  const articleCount = posts.length;
  const categorySet = new Set<string>();
  posts.forEach((p) => (p.categories?.length ? p.categories : [p.category]).forEach((c) => categorySet.add(c)));
  const categoryCount = categorySet.size;

  const readMinutes = posts
    .map((p) => parseInt(p.readingTime.match(/\d+/)?.[0] || "0", 10))
    .filter((n) => n > 0);
  const avgReadTime = readMinutes.length
    ? Math.round(readMinutes.reduce((a, b) => a + b, 0) / readMinutes.length)
    : 0;

  const oldestPost = posts.reduce<string | null>((oldest, p) => {
    if (!oldest || p.publishedDate < oldest) return p.publishedDate;
    return oldest;
  }, null);
  const yearsWriting = oldestPost
    ? Math.max(1, new Date().getFullYear() - new Date(oldestPost).getFullYear() + 1)
    : 1;

  const stats = [
    { label: "Articles Published", value: articleCount },
    { label: "Categories Covered", value: categoryCount },
    { label: "Years Writing", value: yearsWriting },
    { label: "Avg. Read Time", value: avgReadTime ? `${avgReadTime} min` : "—" },
  ];

  return (
    <div className="container-page py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(author)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      {/* ── Hero ── */}
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full ring-4 ring-gold/10">
          <Image src={author.image} alt={author.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white">{author.name}</h1>
          <p className="mt-1 text-gold font-medium">{author.role}</p>
          {(author.company || author.location) && (
            <p className="mt-1 text-sm text-navy/50 dark:text-white/50">
              {[author.company, author.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* ── About ── */}
      {author.bio && (
        <p className="mx-auto mt-8 max-w-3xl text-navy/70 dark:text-white/70 leading-relaxed">
          {author.bio}
        </p>
      )}

      {/* ── Expertise ── */}
      {author.expertise.length > 0 && (
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap gap-2">
          {author.expertise.map((skill) => (
            <span
              key={skill}
              className="bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-gold/15 p-4 text-center">
            <div className="text-2xl font-bold text-navy dark:text-white">{s.value}</div>
            <div className="mt-1 text-xs text-navy/50 dark:text-white/50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Social links ── */}
      {Object.keys(author.social).length > 0 && (
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-4 text-sm sm:justify-start">
          {Object.entries(author.social).map(([key, url]) =>
            url ? (
              <a key={key} href={url} className="text-gold hover:underline" rel="me" target="_blank">
                {SOCIAL_LABELS[key] || key}
              </a>
            ) : null
          )}
          {author.email && (
            <a href={`mailto:${author.email}`} className="text-gold hover:underline">
              Email
            </a>
          )}
        </div>
      )}

      {/* ── Latest articles ── */}
      <h2 className="mt-14 text-2xl font-bold text-navy dark:text-white">
        Articles by {author.name}
      </h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.section === "coffee" ? "coffee" : "blog"}/${post.slug}`}
            className="group overflow-hidden border border-gold/10 shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-video">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-navy group-hover:text-gold dark:text-white">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-navy/50 dark:text-white/50">No published articles yet.</p>
        )}
      </div>

      {/* ── Coffee CTA ── */}
      <div className="mx-auto mt-16 max-w-3xl border border-gold/20 bg-gold/5 p-8 text-center">
        <p className="text-lg font-semibold text-navy dark:text-white">Have a question?</p>
        <Link
          href="/coffee"
          className="mt-3 inline-block text-gold font-medium hover:underline"
        >
          Let&apos;s Have Coffee ☕
        </Link>
      </div>
    </div>
  );
}
