import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// A module-level singleton, not a fresh client per call. Several admin
// components (Sidebar, ProfileForm, ImagePicker, the login page) each used
// to call createClient() independently, which meant multiple GoTrueClient
// instances running their own auto-refresh timer against the same refresh
// token. Supabase rotates the refresh token on every use, so two instances
// refreshing close together race: one succeeds and gets a new token, the
// other's request is rejected as reuse of an already-spent token and can
// clear its own session — which is how a long admin session (composing
// several posts/FAQs) would eventually turn into an "Unauthorized" on
// save with no warning. One shared client removes the race entirely.
let client: SupabaseClient | undefined

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
