import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { getAuthorBySlug } from "@/lib/authors";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import { articleSchema, breadcrumbSchema, faqSchema, howToSchema } from "@/lib/schema";
import ProductsTeaser from "@/components/ProductsTeaser";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import SeriesBanner from "@/components/SeriesBanner";
import { getApprovedComments } from "@/lib/comments";

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
  const url = `${siteConfig.url}/insights/${post.slug}`;

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
  if ((post.section || "insights") === "coffee") notFound();

  const related = await getRelatedPosts(post);
  const author = await getAuthorBySlug(post.authorSlug || "chesly-silaule", post.author);
  const authorUrl = `${siteConfig.url}/author/${author.slug}`;

  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Articles", url: `${siteConfig.url}/insights` },
    { name: post.category, url: `${siteConfig.url}/category/${slugify(post.category)}` },
    { name: post.title, url: `${siteConfig.url}/insights/${post.slug}` }
  ]);

  return (
    <div>
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

      {/* Featured image with the headline overlaid directly on it, spanning
          the full content width (matches the header's logo-to-cart width)
          instead of a separate breadcrumb hero band. Height is ~62% of the
          old aspect-video image (a ~38% reduction) since the headline no
          longer needs a tall canvas to sit above. */}
      <div className="container-page pt-6">
        <div className="relative w-full overflow-hidden aspect-[290/100] sm:aspect-[350/100]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 1152px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <span className="inline-block bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {post.category}
            </span>
            <h1 className="mt-3 max-w-3xl text-xl font-bold leading-tight text-white sm:text-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

    <article className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">

      <SeriesBanner post={post} />

      {/* AI Summary — a concise, self-contained answer AI search engines can quote/cite directly */}
      {post.aiSummary && (
        <div className="mt-7 border-l-4 border-gold bg-gold/5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">AI Summary</h2>
          <p className="mt-2 text-navy dark:text-white">{post.aiSummary}</p>
        </div>
      )}

     <div
        className="prose mt-2 max-w-none text-left prose-headings:text-navy dark:prose-invert dark:prose-headings:text-white prose-headings:mt-8 prose-headings:mb-3 prose-h2:text-xl prose-h3:text-lg prose-p:my-3 prose-img:my-6 prose-blockquote:my-4 prose-ul:my-3 prose-ol:my-3 prose-li:my-1"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Key Takeaways */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <section className="mt-7 border border-gold/20 p-6">
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
        <section className="mt-7 grid gap-6 sm:grid-cols-2">
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
        <section className="mt-7 overflow-x-auto">
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
        <section className="mt-7">
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
        <section className="mt-7 bg-navy p-6 text-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">
            Expert Insight
          </h2>
          <p className="mt-2">{post.expertInsight}</p>
        </section>
      )}

      {/* FAQ */}
      {post.faq && post.faq.length > 0 && (
        <section className="mt-7">
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
        <section className="mt-7">
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

      {/* Byline — moved to the end of the article, right before sharing/author */}
      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-gold/10 pt-6 text-sm text-navy/50 dark:text-white/50">
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

      {/* Social Share */}
      <SocialShare
        title={post.title}
        url={`${siteConfig.url}/insights/${post.slug}`}
        excerpt={post.description}
      />

      <div className="mt-6 flex items-center gap-4 border border-gold/20 p-6">
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
      </div>

      {/* Sidebar — Tags, then Related Articles underneath. Treated as a
          distinct rail (border + divider lines) rather than more inline
          content, so the page reads less like a single long newspaper
          column and more like something you can also browse sideways. */}
      <aside className="space-y-8 lg:pt-2">
        {post.tags?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-navy/60 dark:text-white/50">
              Tags
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
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
          </div>
        )}

        {related.length > 0 && (
          <div aria-labelledby="related-articles-heading">
            <h2 id="related-articles-heading" className="text-xs font-bold uppercase tracking-wide text-navy/60 dark:text-white/50">
              Related Articles
            </h2>
            <div className="mt-3 divide-y divide-gold/10 border border-gold/10">
              {related.map((r) => (
                <Link key={r.slug} href={`/insights/${r.slug}`} className="group block p-3">
                  <div className="relative w-full overflow-hidden aspect-[16/9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={r.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                    />
                    <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-sm font-semibold leading-snug text-white">
                      {r.title}
                    </h3>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-navy/50 dark:text-white/40">
                    {r.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
      </div>

      {post.allowComments !== false && (
        <CommentSection postId={post.id} initialComments={await getApprovedComments(post.id)} />
      )}
    </article>

      <ProductsTeaser />
    </div>
  );
}
