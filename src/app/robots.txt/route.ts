import { NextResponse } from "next/server";
import { getSiteSetting } from "@/lib/settings";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 3600;

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /search

# AI / LLM crawlers — explicitly welcomed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;

// CMS-editable (Settings → SEO → robots.txt). Falls back to a sensible,
// AI-crawler-friendly default when nothing's been customized.
export async function GET() {
  const custom = await getSiteSetting("custom_robots_txt");
  return new NextResponse(custom?.trim() || DEFAULT_ROBOTS, {
    headers: { "Content-Type": "text/plain" },
  });
}
