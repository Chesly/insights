import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import type { Fact } from "@/types";

export const getAllFacts = cache(async (): Promise<Fact[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("facts")
    .select("*")
    .eq("status", "published")
    .order("headline");
  if (error || !data) return [];
  return data as Fact[];
});

export const getFactBySlug = cache(async (slug: string): Promise<Fact | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("facts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error || !data) return null;
  return data as Fact;
});

/** Deterministic "fact of the day" — a day-of-year index into the
    published set, so it rotates daily with zero scheduling/admin upkeep
    and cycles back through the whole pool once a year. Same fact for
    everyone on a given day, and stable across repeat requests/ISR
    revalidation within that day. */
export async function getTodaysFact(): Promise<Fact | null> {
  const facts = await getAllFacts();
  if (facts.length === 0) return null;
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return facts[dayOfYear % facts.length];
}
