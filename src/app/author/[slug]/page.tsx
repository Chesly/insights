import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { authors } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/posts";
import { personSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) return {};
  return {
    title: author.name,
    description: `${author.name} — ${author.role} at ${siteConfig.shortName}. ${author.bio}`,
    alternates: { canonical: `${siteConfig.url}/author/${author.slug}` }
  };
}

export default async function AuthorPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();

  const posts = await getPostsByAuthor(author.slug);
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Authors", url: `${siteConfig.url}/author` },
    { name: author.name, url: `${siteConfig.url}/author/${author.slug}` }
  ]);

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

      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
          <Image src={author.image} alt={author.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">{author.name}</h1>
          <p className="text-gold">{author.role}</p>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-navy/70 dark:text-white/70">{author.bio}</p>

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

      <div className="mx-auto mt-6 flex max-w-3xl gap-4 text-sm">
        {author.social.website && (
          <a href={author.social.website} className="text-gold hover:underline" rel="me">
            Website
          </a>
        )}
        {author.social.linkedin && (
          <a href={author.social.linkedin} className="text-gold hover:underline" rel="me">
            LinkedIn
          </a>
        )}
        {author.social.twitter && (
          <a href={author.social.twitter} className="text-gold hover:underline" rel="me">
            X / Twitter
          </a>
        )}
      </div>

      <h2 className="mt-14 text-2xl font-bold text-navy dark:text-white">
        Articles by {author.name}
      </h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
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
    </div>
  );
}
