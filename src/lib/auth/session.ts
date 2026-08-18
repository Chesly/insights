import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export interface SessionProfile {
  userId: string;
  role: string | null;
}

// Looks up the signed-in user's CMS role (editor / admin / super_admin).
// Returns null only when there's genuinely no session — a lookup FAILURE
// (missing service-role key, profiles table unreachable) returns a
// profile with role: null rather than throwing, so callers can choose
// how to react. The convention used everywhere this is called: fail
// OPEN (allow) when role is null because the check itself couldn't run,
// fail CLOSED (deny) only when the check succeeded and clearly returned
// a non-elevated role. This mirrors the login/rate-limit fail-open
// pattern — an infra hiccup must never lock the one real admin out of
// their own site, the same lesson that broke login once already today.
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const service = createServiceClient();
    const { data: profile } = await service.from("profiles").select("role").eq("id", user.id).single();
    return { userId: user.id, role: profile?.role ?? null };
  } catch {
    return { userId: user.id, role: null };
  }
}

export function isElevated(role: string | null): boolean {
  return role === "admin" || role === "super_admin";
}

// True unless the role check *succeeded* and came back as something
// explicitly non-elevated (e.g. "author"). Missing profile / failed
// lookup / no role column yet all resolve to true — see getSessionProfile.
export function isAllowedElevatedAccess(session: SessionProfile): boolean {
  return session.role === null || isElevated(session.role);
}
