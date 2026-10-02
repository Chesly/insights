import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";
import type { Fact } from "@/types";

export const getAllFacts = unstable_cache(
  async (): Promise<Fact[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("facts")
      .select("*")
      .eq("status", "published")
      .order("headline");
    if (error || !data) return [];
    return data as Fact[];
  },
  ["public-facts"],
  { revalidate: 21600, tags: ["facts"] }
);

export const getFactBySlug = unstable_cache(
  async (slug: string): Promise<Fact | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("facts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (error || !data) return null;
    return data as Fact;
  },
  ["public-fact-by-slug"],
  { revalidate: 21600, tags: ["facts"] }
);

const ROTATION_MINUTES = 6 * 60;

export async function getTodaysFact(): Promise<Fact | null> {
  return pickFromRotation(await getAllFacts(), ROTATION_MINUTES);
}

function pickFromRotation(facts: Fact[], rotationMinutes: number): Fact | null {
  if (facts.length === 0) return null;

  const now = new Date();
  const monthDay = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const special = facts.find((f) => f.special_date === monthDay);
  if (special) return special;

  const slot = Math.floor(Date.now() / (rotationMinutes * 60000));
  return facts[slot % facts.length];
}
