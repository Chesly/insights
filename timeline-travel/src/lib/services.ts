import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export type Service = {
  id: string;
  title: string;
  slug: string;
  icon: string | null;
  heroImage: string | null;
  description: string | null;
  content: string | null;
  benefits: string[];
  faq: { question: string; answer: string }[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToService(row: any): Service {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    icon: row.icon,
    heroImage: row.hero_image,
    description: row.description,
    content: row.content,
    benefits: row.benefits || [],
    faq: row.faq || [],
  };
}

export const getAllServices = cache(async (): Promise<Service[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("display_order");
  if (error || !data) return [];
  return data.map(rowToService);
});

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return rowToService(data);
});
