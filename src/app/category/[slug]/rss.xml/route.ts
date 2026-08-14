import { getPostsByCategory } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { slugify } from "@/lib/types";
import { buildRssXml } from "@/lib/rss";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = siteConfig.categories.find((c) => slugify(c) === slug) || slug;
  const posts = await getPostsByCategory(slug);

  const xml = buildRssXml(posts, {
    title: `${name} | ${siteConfig.name}`,
    description: `Latest ${name} articles from ${siteConfig.shortName}.`,
    selfUrl: `${siteConfig.url}/category/${slug}/rss.xml`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
