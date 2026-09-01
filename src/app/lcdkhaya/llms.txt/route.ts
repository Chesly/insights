import { NextResponse } from "next/server";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getPostsByTag } from "@/lib/posts";
import { getFactsByCategory } from "@/lib/facts";
import { getApprovedTestimonials } from "@/lib/testimonials";
import { slugify } from "@/lib/types";

// Served at /lcdkhaya/llms.txt (and lcdkhaya.co.za/llms.txt once DNS is
// pointed) — an auto-generated summary of LCD Khaya for AI systems
// reading the site, per the emerging llms.txt convention. Mirrors
// src/app/llms.txt/route.ts for the main Insights site.
export const revalidate = 3600;

export async function GET() {
  const [posts, facts, testimonials] = await Promise.all([
    getPostsByTag(lcdKhayaConfig.blogTag),
    getFactsByCategory(lcdKhayaConfig.factsCategory),
    getApprovedTestimonials("lcdkhaya")
  ]);

  const lines = [
    `# ${lcdKhayaConfig.name}`,
    "",
    lcdKhayaConfig.description,
    "",
    `Site: ${lcdKhayaConfig.url}`,
    `Branches: ${lcdKhayaConfig.branches.map((b) => `${b.name} (${b.addressLines.join(", ")}, ${b.postalCode})`).join("; ")}`,
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
    `- Share Your Experience (submit a testimonial): ${lcdKhayaConfig.url}/testimonials`,
    `- FAQ: ${lcdKhayaConfig.url}/faq`,
    ...lcdKhayaConfig.branches.map((b) => `- ${b.name} branch page: ${lcdKhayaConfig.url}/areas/${slugify(b.name)}`),
    "",
    "## FAQ",
    ...lcdKhayaConfig.faqs.map((f) => `- Q: ${f.question}\n  A: ${f.answer}`),
    "",
    ...(posts.length
      ? ["## Recent Articles", ...posts.slice(0, 20).map((p) => `- [${p.title}](${lcdKhayaConfig.url}/blog/${p.slug}): ${p.description}`)]
      : []),
    "",
    ...(facts.length
      ? ["## Did You Know Facts", ...facts.slice(0, 20).map((f) => `- [${f.headline}](${lcdKhayaConfig.url}/facts/${f.slug}): ${f.fact_text}`)]
      : []),
    "",
    ...(testimonials.length
      ? ["## Learner Testimonials", ...testimonials.slice(0, 20).map((t) => `- "${t.content}" — ${t.authorName}`)]
      : []),
    "",
    "## Attribution",
    `Managing Director: ${lcdKhayaConfig.attribution.managingDirector.name} (${lcdKhayaConfig.attribution.managingDirector.email})`,
    `Web Developer: ${lcdKhayaConfig.attribution.webDeveloper.name}, ${lcdKhayaConfig.attribution.webDeveloper.company} (${lcdKhayaConfig.attribution.webDeveloper.email}, ${lcdKhayaConfig.attribution.webDeveloper.urls.join(", ")})`
  ];

  return new NextResponse(lines.join("\n"), { headers: { "Content-Type": "text/plain" } });
}
