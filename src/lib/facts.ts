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

const ROTATION_MINUTES = 6 * 60; // a fresh fact roughly every 6 hours, site-wide

/** Picks the fact currently in rotation. A fact with `special_date` set
    (e.g. "05-01" for Workers' Day) takes over on that exact calendar date
    every year, overriding the normal rotation for the day. Otherwise it's
    a deterministic index into the published set based on the current
    time slot, so it rotates through the whole pool with zero
    scheduling/admin upkeep, and is stable for everyone within that same
    slot (matches the homepage's ISR revalidation interval). */
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
