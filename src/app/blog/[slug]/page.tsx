import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getRelatedPosts, getPostCategories } from "@/lib/posts";
import { getAuthorBySlug } from "@/lib/authors";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import { articleSchema, breadcrumbSchema, faqSchema, howToSchema } from "@/lib/schema";
import SocialShare from "@/components/SocialShare";

export const revalidate = 3600;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.description;
  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: [...(post.keywords || []), ...(post.semanticKeywords || [])],
    authors: [{ name: post.author || siteConfig.owner.name }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author || siteConfig.owner.name],
      section: post.category,
      tags: post.tags
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${url}/opengraph-image`]
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const author = getAuthorBySlug(post.authorSlug || "chesly-silaule");
  const authorUrl = `${siteConfig.url}/author/${author.slug}`;

  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Articles", url: `${siteConfig.url}/blog` },
    { name: post.category, url: `${siteConfig.url}/category/${slugify(post.category)}` },
    { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` }
  ]);

  return (
    <article className="container-page py-12">
      {/* Structured data: Article, Breadcrumb, and (where present) FAQ / HowTo for AI + rich-result eligibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post, authorUrl)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {post.faq && post.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(post.faq)) }}
        />
      )}
      {post.howToSteps && post.howToSteps.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema(post.title, post.howToSteps))
          }}
        />
      )}

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy/50 dark:text-white/50 flex justify-center text-center">
        <ol className="flex flex-wrap items-center justify-center gap-1">
          <li><Link href="/" className="hover:text-gold">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="hover:text-gold">Articles</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            {getPostCategories(post).map((cat, i) => (
              <span key={cat}>
                <Link href={`/category/${slugify(cat)}`} className="hover:text-gold transition-colors">
                  {cat}
                </Link>
                {i < getPostCategories(post).length - 1 && <span className="mx-1 text-white/20">·</span>}
              </span>
            ))}
          </li>
        </ol>
      </nav>

      <header className="mx-auto max-w-3xl text-center">
        <span className="mb-4 inline-block bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
          {post.category}
        </span>
        <h1 className="text-3xl font-bold text-navy dark:text-white sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-navy/60 dark:text-white/60">{post.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-navy/50 dark:text-white/50">
          <span>
            By{" "}
            <Link href={authorUrl} className="font-medium text-gold hover:underline">
              {post.author || siteConfig.owner.name}
            </Link>
          </span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={post.publishedDate}>
            {new Date(post.publishedDate).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <div className="relative mx-auto mt-10 aspect-video max-w-4xl overflow-hidden ">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover"
        />
      </div>

      {/* AI Summary — a concise, self-contained answer AI search engines can quote/cite directly */}
      {post.aiSummary && (
        <div className="mx-auto mt-10 max-w-3xl border-l-4 border-gold bg-gold/5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">AI Summary</h2>
          <p className="mt-2 text-navy dark:text-white">{post.aiSummary}</p>
        </div>
      )}

      <div className="prose prose-lg mx-auto mt-10 max-w-3xl prose-headings:text-navy dark:prose-invert dark:prose-headings:text-white">
        <MDXRemote source={post.content} />
      </div>

      {/* Key Takeaways */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <section className="mx-auto mt-10 max-w-3xl border border-gold/20 p-6">
          <h2 className="text-lg font-bold text-navy dark:text-white">Key Takeaways</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-navy/80 dark:text-white/80">
            {post.keyTakeaways.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Pros & Cons */}
      {(post.pros?.length || post.cons?.length) ? (
        <section className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {post.pros && post.pros.length > 0 && (
            <div className="border border-green-600/20 bg-green-600/5 p-5">
              <h3 className="font-semibold text-navy dark:text-white">Pros</h3>
              <ul className="mt-2 space-y-1 text-sm text-navy/80 dark:text-white/80">
                {post.pros.map((p, i) => (
                  <li key={i}>+ {p}</li>
                ))}
              </ul>
            </div>
          )}
          {post.cons && post.cons.length > 0 && (
            <div className="border border-red-600/20 bg-red-600/5 p-5">
              <h3 className="font-semibold text-navy dark:text-white">Cons</h3>
              <ul className="mt-2 space-y-1 text-sm text-navy/80 dark:text-white/80">
                {post.cons.map((c, i) => (
                  <li key={i}>&minus; {c}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : null}

      {/* Comparison table */}
      {post.comparisonTable && post.comparisonTable.rows.length > 0 && (
        <section className="mx-auto mt-10 max-w-3xl overflow-x-auto">
          {post.comparisonTable.title && (
            <h2 className="mb-3 text-lg font-bold text-navy dark:text-white">
              {post.comparisonTable.title}
            </h2>
          )}
          <table className="w-full border-collapse overflow-hidden border border-gold/20 text-left text-sm">
            <thead className="bg-gold/10">
              <tr>
                <th scope="col" className="p-3 font-semibold text-navy dark:text-white"></th>
                <th scope="col" className="p-3 font-semibold text-navy dark:text-white">
                  {post.comparisonTable.columnAHeader}
                </th>
                <th scope="col" className="p-3 font-semibold text-navy dark:text-white">
                  {post.comparisonTable.columnBHeader}
                </th>
              </tr>
            </thead>
            <tbody>
              {post.comparisonTable.rows.map((row, i) => (
                <tr key={i} className="border-t border-gold/10">
                  <th scope="row" className="p-3 font-medium text-navy dark:text-white">
                    {row.label}
                  </th>
                  <td className="p-3 text-navy/80 dark:text-white/80">{row.columnA}</td>
                  <td className="p-3 text-navy/80 dark:text-white/80">{row.columnB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Definitions — glossary-style entity definitions AI engines can lift directly */}
      {post.definitions && post.definitions.length > 0 && (
        <section className="mx-auto mt-10 max-w-3xl">
          <h2 className="text-lg font-bold text-navy dark:text-white">Definitions</h2>
          <dl className="mt-3 space-y-4">
            {post.definitions.map((d, i) => (
              <div key={i}>
                <dt className="font-semibold text-navy dark:text-white">{d.question}</dt>
                <dd className="mt-1 text-navy/70 dark:text-white/70">{d.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Expert Insight */}
      {post.expertInsight && (
        <section className="mx-auto mt-10 max-w-3xl bg-navy p-6 text-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">
            Expert Insight
          </h2>
          <p className="mt-2">{post.expertInsight}</p>
        </section>
      )}

      {/* FAQ */}
      {post.faq && post.faq.length > 0 && (
        <section className="mx-auto mt-10 max-w-3xl">
          <h2 className="text-lg font-bold text-navy dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-3 divide-y divide-gold/10 border border-gold/20">
            {post.faq.map((item, i) => (
              <details key={i} className="group p-4">
                <summary className="cursor-pointer list-none font-medium text-navy marker:content-none dark:text-white">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-navy/70 dark:text-white/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Topics / semantic entities */}
      {post.relatedTopics && post.relatedTopics.length > 0 && (
        <section className="mx-auto mt-10 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/60 dark:text-white/60">
            Related Topics
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.relatedTopics.map((topic) => (
              <span
                key={topic}
                className="border border-gold/20 px-3 py-1 text-xs text-navy/70 dark:text-white/70"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      )}

      {post.tags?.length > 0 && (
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${slugify(tag)}`}
              className="border border-gold/30 px-3 py-1 text-xs text-navy/70 hover:bg-gold/10 dark:text-white/70"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      
      {/* Social Share */}
      <SocialShare
        title={post.title}
        url={`${siteConfig.url}/blog/${post.slug}`}
        excerpt={post.description}
      />

      <div className="mx-auto mt-8 flex max-w-3xl items-center gap-4 border border-gold/20 p-6">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
          <Image src={author.image} alt={author.name} fill className="object-cover" />
        </div>
        <div>
          <Link href={authorUrl} className="text-sm font-semibold text-navy hover:text-gold dark:text-white">
            Written by {post.author || author.name}
          </Link>
          <p className="mt-1 text-sm text-navy/60 dark:text-white/60">{author.role} at {siteConfig.shortName}.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl" aria-labelledby="related-articles-heading">
          <h2 id="related-articles-heading" className="mb-6 text-2xl font-bold text-navy dark:text-white">
            Related Articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="border border-gold/10 p-4 hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase text-gold">{r.category}</span>
                <h3 className="mt-1 text-sm font-semibold text-navy dark:text-white">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
