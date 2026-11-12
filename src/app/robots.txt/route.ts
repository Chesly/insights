import { NextResponse } from "next/server";
import { getSiteSetting } from "@/lib/settings";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 3600;

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /admin/
Disallow: /ct-login
Disallow: /register
Disallow: /cart
Disallow: /checkout/
Disallow: /invoice/
Disallow: /download/

# AI / LLM crawlers — public content is welcome; private routes stay excluded
User-agent: GPTBot
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /admin/
Disallow: /ct-login
Disallow: /register
Disallow: /cart
Disallow: /checkout/
Disallow: /invoice/
Disallow: /download/

User-agent: ChatGPT-User
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /admin/
Disallow: /ct-login
Disallow: /register
Disallow: /cart
Disallow: /checkout/
Disallow: /invoice/
Disallow: /download/

User-agent: PerplexityBot
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /admin/
Disallow: /ct-login
Disallow: /register
Disallow: /cart
Disallow: /checkout/
Disallow: /invoice/
Disallow: /download/

User-agent: ClaudeBot
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /admin/
Disallow: /ct-login
Disallow: /register
Disallow: /cart
Disallow: /checkout/
Disallow: /invoice/
Disallow: /download/

User-agent: Google-Extended
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /admin/
Disallow: /ct-login
Disallow: /register
Disallow: /cart
Disallow: /checkout/
Disallow: /invoice/
Disallow: /download/

User-agent: CCBot
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /admin/
Disallow: /ct-login
Disallow: /register
Disallow: /cart
Disallow: /checkout/
Disallow: /invoice/
Disallow: /download/

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
