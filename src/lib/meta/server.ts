import { createHash, randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

// Server-side Meta Conversions API sender. Two callers use this:
//   - /api/meta/capi, relaying browser-fired events (see lib/meta-events.ts)
//   - lib/orders.ts, firing Purchase directly from fulfillment — no HTTP
//     round-trip to our own API needed since we're already on the server.
//
// Two jobs, same as the browser path:
//   1. Send the event to Meta with hashed identity.
//   2. Write the same event to Supabase so we own the attribution data
//      instead of depending on Ads Manager's reporting window.

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE; // unset in production
const API_VERSION = process.env.META_API_VERSION || "v21.0";

/** Meta requires SHA-256 of the trimmed, lowercased value. */
function hashValue(value?: string): string | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return undefined;
  return createHash("sha256").update(normalised).digest("hex");
}

/** E.164-ish: digits only, ZA numbers normalised to 27XXXXXXXXX. */
function hashPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "27" + digits.slice(1);
  return digits ? createHash("sha256").update(digits).digest("hex") : undefined;
}

export interface ServerEventInput {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
  identity?: { email?: string; phone?: string };
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  attribution?: Record<string, unknown>;
}

export interface ServerEventResult {
  ok: true;
  metaOk: boolean;
  eventId: string;
}

export async function sendServerEvent(input: ServerEventInput): Promise<ServerEventResult> {
  const eventId = input.eventId ?? randomUUID();
  const customData = input.customData ?? {};
  const identity = input.identity ?? {};
  const attribution = input.attribution ?? {};

  const em = hashValue(identity.email);
  const ph = hashPhone(identity.phone);

  const userData: Record<string, unknown> = {
    client_ip_address: input.clientIp,
    client_user_agent: input.userAgent,
  };
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  // ---- 1. Persist to Supabase first. Our data matters more than Meta's. ----
  // Only the hash is stored, never the plaintext email, so this table is
  // safe to query and export without dragging PII around.
  const supabase = createServiceClient();
  const { error: dbError } = await supabase.from("ad_events").insert({
    event_name: input.eventName,
    event_id: eventId,
    event_source_url: input.eventSourceUrl ?? null,
    email_hash: em ?? null,
    value: typeof customData.value === "number" ? customData.value : null,
    currency: (customData.currency as string) ?? null,
    utm_source: (attribution.utm_source as string) ?? null,
    utm_medium: (attribution.utm_medium as string) ?? null,
    utm_campaign: (attribution.utm_campaign as string) ?? null,
    utm_content: (attribution.utm_content as string) ?? null,
    fbclid: (attribution.fbclid as string) ?? null,
    landing_path: (attribution.landing_path as string) ?? null,
    referrer: (attribution.referrer as string) ?? null,
    custom_data: customData,
  });
  if (dbError) console.error("[meta:db]", input.eventName, dbError.message);

  // ---- 2. Forward to Meta ----
  let metaOk = false;
  if (PIXEL_ID && ACCESS_TOKEN) {
    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: input.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: input.eventSourceUrl,
          action_source: "website",
          user_data: userData,
          custom_data: customData,
        },
      ],
    };
    if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

    try {
      const res = await fetch(
        `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      metaOk = res.ok;
      if (!res.ok) console.error("[meta:capi]", input.eventName, (await res.text()).slice(0, 300));
    } catch (e) {
      console.error("[meta:capi]", input.eventName, e instanceof Error ? e.message : "request failed");
    }
  } else {
    console.error("[meta:capi]", input.eventName, "META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set");
  }

  return { ok: true, metaOk, eventId };
}
