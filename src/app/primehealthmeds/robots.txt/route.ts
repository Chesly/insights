import { NextResponse } from "next/server";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";

// Served at /primehealthmeds/robots.txt (and primehealthmeds.co.za/robots.txt
// once DNS is pointed, via a host rewrite) — mirrors src/app/lcdkhaya/robots.txt/route.ts.
export const revalidate = 3600;

const ROBOTS = `User-agent: *
Allow: /

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

Sitemap: ${cfg.url}/sitemap.xml
`;

export async function GET() {
  return new NextResponse(ROBOTS, { headers: { "Content-Type": "text/plain" } });
}
