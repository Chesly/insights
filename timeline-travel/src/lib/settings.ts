import { cache } from "react";
import { createPublicClient } from "./supabase/public";

// Cached per-request: header, footer, and WhatsApp button all read
// settings during the same render and share one query.
export const getAllSiteSettings = cache(async (): Promise<Record<string, string>> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("site_settings").select("key,value");
  if (error || !data) return {};
  const settings: Record<string, string> = {};
  data.forEach((row) => { settings[row.key] = row.value || ""; });
  return settings;
});

export async function getSiteSetting(key: string): Promise<string> {
  const settings = await getAllSiteSettings();
  return settings[key] || "";
}
