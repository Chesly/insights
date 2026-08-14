import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { buildRssXml } from "@/lib/rss";

export async function GET() {
  const posts = await getAllPosts(false, ["insights", "coffee"]);

  const xml = buildRssXml(posts, {
    title: siteConfig.name,
    description: siteConfig.description,
    selfUrl: `${siteConfig.url}/rss.xml`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
