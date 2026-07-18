import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import type { Author } from "./types";
import { siteConfig } from "./siteConfig";

// Fallback used only if the database is unreachable, or as the shape for
// posts whose byline doesn't match any real CMS profile (guest writers).
export const defaultAuthor: Author = {
  slug: "chesly-silaule",
  name: siteConfig.owner.name,
  role: "Founder & AI Creative Strategist",
  bio: "Chesly Silaule is the founder of Chesly.Tech, a South African knowledge platform dedicated to helping entrepreneurs build smarter, more sustainable businesses.",
  image: "https://ik.imagekit.io/mkvu8hdr5/insights/Chesly_Silaule.jpg",
  expertise: [],
  social: { website: siteConfig.owner.url },
  email: siteConfig.contact.email,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAuthor(row: any): Author {
  return {
    slug: row.public_slug,
    name: row.full_name || "Team Member",
    role: row.job_title || "Contributor",
    bio: row.bio || "",
    image: row.avatar_url || defaultAuthor.image,
    expertise: row.expertise || [],
    social: {
      website: row.website || undefined,
      linkedin: row.linkedin_url || undefined,
      facebook: row.facebook_url || undefined,
      instagram: row.instagram_url || undefined,
      youtube: row.youtube_url || undefined,
      github: row.github_url || undefined,
    },
    email: row.public_email || undefined,
    company: row.company || undefined,
    location: row.location || undefined,
  };
}

// Every CMS user with a public_slug set and their author page enabled.
// Cached per-request since author listing + sitemap + individual pages
// may all need this during the same render.
export const getAllAuthors = cache(async (): Promise<Author[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("show_author_page", true)
    .not("public_slug", "is", null);
  if (error || !data || data.length === 0) return [defaultAuthor];
  return data.map(rowToAuthor);
});

// Resolves a post's byline to a full Author. If the slug matches a real
// CMS profile with their author page enabled, returns their full profile.
// Otherwise (guest writer, or someone who's turned their author page off)
// falls back to a lightweight author built from just the post's stored
// author name/slug — no bio, no social links, no stats.
export async function getAuthorBySlug(slug: string, fallbackName?: string): Promise<Author> {
  const authors = await getAllAuthors();
  const match = authors.find((a) => a.slug === slug);
  if (match) return match;
  return {
    slug,
    name: fallbackName || defaultAuthor.name,
    role: "Contributor",
    bio: "",
    image: defaultAuthor.image,
    expertise: [],
    social: {},
    isGuest: true,
  };
}
