import { cache } from "react";
import { createPublicClient } from "./supabase/public";

export type Page = {
  id: string;
  title: string;
  slug: string;
  body?: string;
  status: "draft" | "published";
  seo_title?: string;
  meta_description?: string;
  og_image?: string;
};

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return data as Page;
});
