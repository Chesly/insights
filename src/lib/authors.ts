import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";
import type { Author } from "./types";
import { siteConfig } from "./siteConfig";

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

// Public author profiles change infrequently, so keep them in Next's
// persistent Data Cache instead of querying profiles on crawler/page hits.
export const getAllAuthors = unstable_cache(
  async (): Promise<Author[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("public_slug,full_name,job_title,bio,avatar_url,expertise,website,linkedin_url,facebook_url,instagram_url,youtube_url,github_url,public_email,company,location")
      .eq("show_author_page", true)
      .not("public_slug", "is", null);
    if (error || !data || data.length === 0) return [defaultAuthor];
    return data.map(rowToAuthor);
  },
  ["public-authors"],
  { revalidate: 3600, tags: ["authors"] }
);

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
