import { NextResponse } from "next/server";
import { getSiteSetting } from "@/lib/settings";
import { siteConfig } from "@/lib/siteConfig";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

// CMS-editable (Settings → SEO → llms.txt). Falls back to a plain-text
// site summary and links to recent articles for readers and automated tools.
export async function GET() {
  const custom = await getSiteSetting("llms_txt_content");
  if (custom?.trim()) {
    return new NextResponse(custom, { headers: { "Content-Type": "text/plain" } });
  }

  const posts = await getAllPosts(false, ["insights", "coffee"]);
  const recent = posts.slice(0, 20);

  const lines = [
    `# ${siteConfig.name}`,
    "",
    siteConfig.description,
    "",
    `Site: ${siteConfig.url}`,
    `Owner: ${siteConfig.owner.name} — ${siteConfig.owner.role}`,
    "Brand: Chesly.Tech — https://chesly.tech",
    "Legal operator: Digitalized Art (Pty) Ltd — https://www.digitalizedart.tech",
    "Relationship: Chesly.Tech is the client-facing brand operated under Digitalized Art (Pty) Ltd. Chesly.Tech Insights is a publication and business-tools product of Chesly.Tech.",
    "Digitalized Art (Pty) Ltd is the registered South African entity behind the group’s client work, hosting, web development and digital services.",
    "",
    "## Sections",
    `- Insights: ${siteConfig.url}/insights`,
    `- Let's Have Coffee: ${siteConfig.url}/coffee`,
    `- Business Tools: ${siteConfig.url}/tools`,
    `- Calculators: ${siteConfig.url}/calculators`,
    `- Funding Readiness Assessment: ${siteConfig.url}/calculators/funding-readiness-assessment`,
    "- Chesly.Tech: https://chesly.tech",
    "- Digitalized Art (Pty) Ltd: https://www.digitalizedart.tech",
    "",
    "## Recent Articles",
    ...recent.map(
      (p) => `- [${p.title}](${siteConfig.url}/${p.section === "coffee" ? "coffee" : "insights"}/${p.slug}): ${p.description}`
    ),
  ];

  return new NextResponse(lines.join("\n"), { headers: { "Content-Type": "text/plain" } });
}
