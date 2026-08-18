import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

// Login now goes through this route instead of calling
// supabase.auth.signInWithPassword() directly from the client, so a
// brute-force attempt can actually be throttled server-side — Supabase's
// own platform-level auth rate limit is generic, not specific to this
// one admin account. Every check here is best-effort and fails OPEN: if
// the login_attempts table doesn't exist yet, or the service-role key is
// misconfigured, real admin logins must still work — a broken rate
// limiter should never become a site-wide lockout.
export async function POST(req: NextRequest) {
  try {
    return await handleLogin(req);
  } catch (err) {
    // Last-resort net — an opaque empty 500 here means an admin can't log
    // in at all with no way to tell why, so surface whatever broke.
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleLogin(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const ip = getClientIp(req);
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  // createServiceClient() itself throws synchronously if the service-role
  // key is missing/misconfigured — that must not take the whole route
  // down with it, so it's created inside the same try as the query that
  // uses it. `service` stays null when unavailable, and every step below
  // treats that as "rate limiting is temporarily unavailable", not as a
  // reason to block a real login.
  let service: ReturnType<typeof createServiceClient> | null = null;
  try {
    service = createServiceClient();
    const { count } = await service
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("success", false)
      .gte("created_at", since)
      .or(`email.eq.${email},ip.eq.${ip}`);

    if ((count || 0) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.` },
        { status: 429 }
      );
    }
  } catch {
    // Rate-limit check itself failed — proceed to the real login rather
    // than block everyone.
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  try {
    if (service) {
      await service.from("login_attempts").insert({ email, ip, success: !error });
    }
  } catch {
    // Logging the attempt is best-effort too — never let it affect the
    // actual login outcome above.
  }

  if (error) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
