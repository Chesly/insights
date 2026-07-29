import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVICE-ROLE client — bypasses Row Level Security entirely. Only ever
// import this into server-side code (API routes, server actions) that
// runs on the checkout flow — an anonymous shopper has no Supabase auth
// session, so this is what lets the order be created/updated at all.
// NEVER import this into a "use client" component or expose the key
// (SUPABASE_SERVICE_ROLE_KEY, no NEXT_PUBLIC_ prefix) to the browser.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
