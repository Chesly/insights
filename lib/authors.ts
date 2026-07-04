import type { Author } from "./types";
import { siteConfig } from "./siteConfig";

/**
 * Author registry. Add new authors here; reference by `authorSlug` in post
 * frontmatter. Falls back to the default author (site owner) when a post has
 * no authorSlug, or when the slug doesn't match an entry below.
 */
export const authors: Author[] = [
  {
    slug: "chesly-silaule",
    name: siteConfig.owner.name,
    role: "Founder & AI Creative Strategist",
    bio:
      "Chesly Silaule is an AI Creative Strategist and Digital Brand Specialist based in Johannesburg, South Africa, with 15+ years of experience in branding, web design, and AI-assisted creative workflows. He is the founder of Chesly.Tech and Digitalized Art (Pty) Ltd.",
    image: siteConfig.branding.logoHeader,
    expertise: ["Artificial Intelligence", "SEO & GEO", "Web Design", "Digital Strategy", "Branding"],
    social: {
      website: siteConfig.owner.url,
      linkedin: siteConfig.social.find((s) => s.icon === "linkedin")?.href
    },
    email: siteConfig.contact.email
  }
];

export const defaultAuthor = authors[0];

export function getAuthorBySlug(slug: string): Author {
  return authors.find((a) => a.slug === slug) || defaultAuthor;
}

export function getAllAuthors(): Author[] {
  return authors;
}
