import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export type Destination = {
  id: string;
  title: string;
  slug: string;
  heroImage: string | null;
  gallery: string[];
  description: string | null;
  thingsToDo: { title: string; description?: string }[];
  travelInfo: string | null;
  faq: { question: string; answer: string }[];
  featured: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToDestination(row: any): Destination {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    heroImage: row.hero_image,
    gallery: row.gallery || [],
    description: row.description,
    thingsToDo: row.things_to_do || [],
    travelInfo: row.travel_info,
    faq: row.faq || [],
    featured: !!row.featured,
  };
}

export const getAllDestinations = cache(async (): Promise<Destination[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("published", true)
    .order("title");
  if (error || !data) return [];
  return data.map(rowToDestination);
});

export const getFeaturedDestinations = cache(async (): Promise<Destination[]> => {
  const all = await getAllDestinations();
  const featured = all.filter((d) => d.featured);
  return featured.length > 0 ? featured : all;
});

export const getDestinationBySlug = cache(async (slug: string): Promise<Destination | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return rowToDestination(data);
});
