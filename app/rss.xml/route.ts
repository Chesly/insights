import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteConfig.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedDate).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${p.author || siteConfig.owner.name}]]></dc:creator>
      <description><![CDATA[${p.description}]]></description>
      <content:encoded><![CDATA[${p.aiSummary || p.description}]]></content:encoded>
      <category><![CDATA[${p.category}]]></category>
      ${p.tags.map((t) => `<category><![CDATA[${t}]]></category>`).join("")}
      <enclosure url="${p.image}" type="image/png" />
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>${siteConfig.language}</language>
    <image>
      <url>${siteConfig.branding.logoHeader}</url>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
    </image>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
