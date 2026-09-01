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

/** Facts scoped to one category — e.g. LCD Khaya's "Did You Know" page
    reuses this shared facts table filtered to category "Driving" instead
    of getting its own table, same pattern as getPostsByCategory. */
export async function getFactsByCategory(category: string): Promise<Fact[]> {
  const facts = await getAllFacts();
  return facts.filter((f) => (f.category || "").toLowerCase() === category.toLowerCase());
}

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

const ROTATION_HOURS = 6; // 24 / 4 — a fresh fact roughly every 6 hours

/** Picks the fact currently in rotation. A fact with `special_date` set
    (e.g. "05-01" for Workers' Day) takes over on that exact calendar date
    every year, overriding the normal rotation for the day. Otherwise it's
    a deterministic index into the published set based on the current
    6-hour slot, so it rotates through the whole pool with zero
    scheduling/admin upkeep, and is stable for everyone within that same
    slot (matches the homepage's hourly ISR revalidation). */
export async function getTodaysFact(): Promise<Fact | null> {
  return pickFromRotation(await getAllFacts());
}

/** Same rotation as getTodaysFact, scoped to one category — so a
    category-specific "Did You Know" widget (e.g. LCD Khaya's homepage)
    doesn't show an unrelated fact just because it's in rotation
    site-wide. */
export async function getTodaysFactByCategory(category: string): Promise<Fact | null> {
  return pickFromRotation(await getFactsByCategory(category));
}

function pickFromRotation(facts: Fact[]): Fact | null {
  if (facts.length === 0) return null;

  const now = new Date();
  const monthDay = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const special = facts.find((f) => f.special_date === monthDay);
  if (special) return special;

  const slot = Math.floor(Date.now() / (ROTATION_HOURS * 3600000));
  return facts[slot % facts.length];
}
