import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";

// Site settings are shared by every public page (layout, verification tags,
// consent/tracking). Persisting them across requests prevents every page view
// and crawler render from hitting Supabase for the same small settings table.
export const getAllSiteSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error || !data) return {};
    const settings: Record<string, string> = {};
    data.forEach((row) => { settings[row.key] = row.value || ""; });
    return settings;
  },
  ["public-site-settings"],
  { revalidate: 3600, tags: ["site-settings"] }
);

export async function getSiteSetting(key: string): Promise<string> {
  const settings = await getAllSiteSettings();
  return settings[key] || "";
}
