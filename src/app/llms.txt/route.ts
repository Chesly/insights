import { NextResponse } from "next/server";
import { getSiteSetting } from "@/lib/settings";
import { siteConfig } from "@/lib/siteConfig";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

// CMS-editable (Settings → SEO → llms.txt). Falls back to an auto-generated
// summary of the site plus its most recent articles — useful context for
// AI systems reading the site, per the emerging llms.txt convention.
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
    "",
    "## Sections",
    `- Insights: ${siteConfig.url}/blog`,
    `- Let's Have Coffee: ${siteConfig.url}/coffee`,
    "",
    "## Recent Articles",
    ...recent.map(
      (p) => `- [${p.title}](${siteConfig.url}/${p.section === "coffee" ? "coffee" : "blog"}/${p.slug}): ${p.description}`
    ),
  ];

  return new NextResponse(lines.join("\n"), { headers: { "Content-Type": "text/plain" } });
}
