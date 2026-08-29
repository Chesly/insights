import { NextResponse } from "next/server";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getPostsByTag } from "@/lib/posts";
import { getFactsByCategory } from "@/lib/facts";

// Served at /lcdkhaya/llms.txt (and lcdkhaya.co.za/llms.txt once DNS is
// pointed) — an auto-generated summary of LCD Khaya for AI systems
// reading the site, per the emerging llms.txt convention. Mirrors
// src/app/llms.txt/route.ts for the main Insights site.
export const revalidate = 3600;

export async function GET() {
  const [posts, facts] = await Promise.all([
    getPostsByTag(lcdKhayaConfig.blogTag),
    getFactsByCategory(lcdKhayaConfig.factsCategory)
  ]);

  const lines = [
    `# ${lcdKhayaConfig.name}`,
    "",
    lcdKhayaConfig.description,
    "",
    `Site: ${lcdKhayaConfig.url}`,
    `Areas served: ${lcdKhayaConfig.contact.serviceAreas.join(", ")}`,
    `Contact: ${lcdKhayaConfig.contact.email} / ${lcdKhayaConfig.contact.phone}`,
    "",
    "## Services & Packages",
    ...lcdKhayaConfig.packages.map((p) => `- ${p.name} (${p.code}): ${p.description}`),
    "",
    "## Sections",
    `- About: ${lcdKhayaConfig.url}/about`,
    `- Services & Packages: ${lcdKhayaConfig.url}/services`,
    `- Book a Lesson: ${lcdKhayaConfig.url}/booking`,
    `- Did You Know?: ${lcdKhayaConfig.url}/facts`,
    `- Blog: ${lcdKhayaConfig.url}/blog`,
    "",
    ...(posts.length
      ? ["## Recent Articles", ...posts.slice(0, 20).map((p) => `- [${p.title}](${lcdKhayaConfig.url}/blog/${p.slug}): ${p.description}`)]
      : []),
    "",
    ...(facts.length
      ? ["## Did You Know Facts", ...facts.slice(0, 20).map((f) => `- [${f.headline}](${lcdKhayaConfig.url}/facts/${f.slug}): ${f.fact_text}`)]
      : [])
  ];

  return new NextResponse(lines.join("\n"), { headers: { "Content-Type": "text/plain" } });
}
