import type { Author } from "./types";

/**
 * Author registry. Add new authors here; reference by `authorSlug` in post
 * frontmatter. Falls back to the default author (site owner) when a post has
 * no authorSlug, or when the slug doesn't match an entry below.
 */
export const authors: Author[] = [
  {
    slug: "chesly-silaule",
    name: "Chesly Silaule",
    role: "Founder & AI Creative Strategist",
    bio:
      "Chesly Silaule is an AI Creative Strategist and Digital Brand Specialist based in Johannesburg, South Africa, with 15+ years of experience in branding, web design, and AI-assisted creative workflows. He is the founder of Chesly.Tech and Digitalized Art (Pty) Ltd.",
    image: "https://chesly.tech/insights/images/chesly.tech_logo.png",
    expertise: ["Artificial Intelligence", "SEO & GEO", "Web Design", "Digital Strategy", "Branding"],
    social: {
      website: "https://chesly.tech",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com"
    },
    email: "hello@chesly.tech"
  }
];

export const defaultAuthor = authors[0];

export function getAuthorBySlug(slug: string): Author {
  return authors.find((a) => a.slug === slug) || defaultAuthor;
}

export function getAllAuthors(): Author[] {
  return authors;
}
