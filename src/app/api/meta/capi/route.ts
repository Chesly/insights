import { NextRequest, NextResponse } from "next/server";
import { sendServerEvent } from "@/lib/meta/server";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string | undefined {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : undefined;
}

// POST — relays a browser-fired Meta event (see lib/meta-events.ts) to the
// Conversions API and logs it to Supabase. Always 200: the client must
// never retry or surface a tracking failure to the visitor.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const {
    event_name,
    event_id,
    event_source_url,
    custom_data = {},
    identity = {},
    fbp,
    fbc,
    attribution = {},
  } = body as {
    event_name?: string;
    event_id?: string;
    event_source_url?: string;
    custom_data?: Record<string, unknown>;
    identity?: { email?: string; phone?: string };
    fbp?: string;
    fbc?: string;
    attribution?: Record<string, unknown>;
  };

  if (!event_name) {
    return NextResponse.json({ ok: false, error: "event_name required" }, { status: 400 });
  }

  const result = await sendServerEvent({
    eventName: event_name,
    eventId: event_id,
    eventSourceUrl: event_source_url,
    customData: custom_data,
    identity,
    fbp,
    fbc,
    clientIp: clientIp(req),
    userAgent: req.headers.get("user-agent") || undefined,
    attribution,
  });

  return NextResponse.json({ ok: true, meta: result.metaOk, event_id: result.eventId });
}
