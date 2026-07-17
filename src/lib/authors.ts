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
      "Chesly Silaule is the founder of Chesly.Tech, a South African knowledge platform dedicated to helping entrepreneurs build smarter, more sustainable businesses. Combining practical business experience with AI-powered research, he creates easy-to-follow guides covering business registration, government procurement, funding, compliance, digital transformation, marketing and emerging technologies.",
    image: "https://ik.imagekit.io/mkvu8hdr5/insights/Chesly_Silaule.jpg",
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
