import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TEMPORARY — diagnosing why SUPABASE_SERVICE_ROLE_KEY isn't reaching the
// runtime despite showing as saved in the Vercel dashboard. Reveals only
// key presence/length, never values. Delete this file once resolved.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const relevant = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "PAYSTACK_SECRET_KEY",
    "IMAGEKIT_PRIVATE_KEY",
  ];

  const report: Record<string, { present: boolean; length: number; prefix: string }> = {};
  for (const key of relevant) {
    const value = process.env[key];
    report[key] = {
      present: !!value,
      length: value?.length || 0,
      prefix: value ? value.slice(0, 6) : "",
    };
  }

  return NextResponse.json({
    vercelEnv: process.env.VERCEL_ENV || null,
    totalEnvVarCount: Object.keys(process.env).length,
    report,
  });
}
