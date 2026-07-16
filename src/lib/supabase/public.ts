import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Read-only, anon-key client for public content queries (posts, categories,
// tags). Not tied to request cookies, so it can be called from anywhere —
// layouts, route handlers, sitemap/rss generation, etc.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
