import { NextResponse } from "next/server";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

// Served at /lcdkhaya/robots.txt (and lcdkhaya.co.za/robots.txt once DNS
// is pointed, via the proxy host rewrite). Mirrors the AI-crawler
// allowlist in the main site's src/app/robots.txt/route.ts — kept as a
// separate file rather than a shared helper since a sitemap/robots file
// must point at its own host, not the other site's.
export const revalidate = 3600;

const ROBOTS = `User-agent: *
Allow: /

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

Sitemap: ${lcdKhayaConfig.url}/sitemap.xml
`;

export async function GET() {
  return new NextResponse(ROBOTS, { headers: { "Content-Type": "text/plain" } });
}
