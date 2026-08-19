"use client"
import { createClient } from "@/lib/supabase/client"

/** Wraps fetch for admin API calls: on a 401 — a session that went stale
    during a long editing session — refreshes it once and retries before
    giving up, instead of failing outright and losing whatever was just
    written (e.g. several FAQs, or a whole post/product). */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, options)
  if (res.status !== 401) return res
  const supabase = createClient()
  const { data, error } = await supabase.auth.refreshSession()
  if (error || !data.session) return res
  return fetch(url, options)
}
