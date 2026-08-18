import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import type { Page } from "@/types";

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error || !data) return null;
  return data as Page;
});
