// Single source of truth for every Meta event fired on insights.chesly.tech.
// Fires the browser Pixel AND the server CAPI with the same event_id so Meta
// deduplicates them. Browser-only events lose signal to ad blockers and ITP;
// CAPI recovers it.
//
// Every call is gated on the same POPIA/GDPR consent decision that governs
// GTM/Clarity (see ConsentManager) — until a visitor accepts, this never
// touches the network, matching the rest of the site's tracking.

type Json = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "ct_cookie_consent";
const ATTR_KEY = "ct_attr_v1";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Attribution = {
  fbclid?: string;
  landing_path?: string;
  referrer?: string;
  first_seen?: string;
} & Partial<Record<(typeof UTM_KEYS)[number], string>>;

function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Attribution capture                                                 */
/* ------------------------------------------------------------------ */

/**
 * Call once on first page load. Stores UTMs + fbclid for the session so a
 * Purchase three pages later still knows which ad paid for it. Safe to run
 * before consent — it only remembers URL params locally, it doesn't send
 * anything anywhere. First-touch wins: never overwrites an existing record.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const existing = readAttribution();
  if (existing.first_seen) return existing;

  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {
    first_seen: new Date().toISOString(),
    landing_path: window.location.pathname,
    referrer: document.referrer || undefined,
  };

  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) attr[k] = v;
  }
  const fbclid = params.get("fbclid");
  if (fbclid) attr.fbclid = fbclid;

  try {
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {
    /* private mode — proceed without persistence */
  }
  return attr;
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) || "{}");
  } catch {
    return {};
  }
}

/* ------------------------------------------------------------------ */
/* Meta click / browser identifiers                                    */
/* ------------------------------------------------------------------ */

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

/**
 * _fbc is set by the Pixel when a visitor arrives with ?fbclid=. If the
 * Pixel hasn't written it yet, build it ourselves in Meta's format:
 * fb.1.<unix_ms>.<fbclid>
 */
function getFbc(): string | undefined {
  const cookie = getCookie("_fbc");
  if (cookie) return cookie;
  const fbclid = readAttribution().fbclid;
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

function getFbp(): string | undefined {
  return getCookie("_fbp");
}

/** Exposed so the checkout flow can stamp an order with the click ids that
    were live at add-to-cart time — fulfillment (which may happen minutes
    later, server-side, off a webhook) has no cookies of its own to read. */
export function getClickIds(): { fbp?: string; fbc?: string } {
  return { fbp: getFbp(), fbc: getFbc() };
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/* ------------------------------------------------------------------ */
/* The event taxonomy                                                  */
/* ------------------------------------------------------------------ */
// Standard events are the ones Meta's optimiser understands. Custom events
// are for our own dashboard only — Meta treats them as second-class signal.

export const EV = {
  // standard
  VIEW_CONTENT: "ViewContent",
  LEAD: "Lead",
  ADD_TO_CART: "AddToCart",
  INITIATE_CHECKOUT: "InitiateCheckout",
  PURCHASE: "Purchase",
  // custom — funnel depth, for diagnosing WHERE people fall out
  CALC_STARTED: "CalculatorStarted",
  CALC_COMPLETED: "CalculatorCompleted",
  CALC_PRICED: "CalculatorPriced",
  TOOLKIT_CTA_CLICK: "ToolkitCtaClick",
} as const;

const STANDARD = new Set<string>([
  EV.VIEW_CONTENT,
  EV.LEAD,
  EV.ADD_TO_CART,
  EV.INITIATE_CHECKOUT,
  EV.PURCHASE,
  "PageView",
]);

export type TrackOptions = {
  /** Plain email/phone. Hashed server-side only — never leaves as plaintext to Meta. */
  identity?: { email?: string; phone?: string };
  /** Meta standard params: value, currency, content_ids, content_name, etc. */
  params?: Json;
};

/**
 * Fire an event to both destinations. Never throws — a tracking failure
 * must not break the page it's called from. No-ops entirely until the
 * visitor has accepted the cookie banner (see ConsentManager) — this is
 * the single gate every Meta event goes through, browser pixel and server
 * CAPI alike.
 */
export async function track(
  eventName: string,
  { identity, params = {} }: TrackOptions = {}
): Promise<void> {
  if (typeof window === "undefined") return;
  if (!hasMarketingConsent()) return;

  const eventId = newEventId();
  const attribution = readAttribution();

  // 1. Browser pixel — only present once ConsentManager has injected it.
  try {
    const fn = STANDARD.has(eventName) ? "track" : "trackCustom";
    window.fbq?.(fn, eventName, params, { eventID: eventId });
  } catch {
    /* blocked — CAPI still covers us */
  }

  // 2. Server CAPI (same event_id => deduplicated by Meta)
  try {
    await fetch("/api/meta/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true, // survives navigation on CTA clicks
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: params,
        identity,
        fbp: getFbp(),
        fbc: getFbc(),
        attribution,
      }),
    });
  } catch {
    /* offline or blocked — pixel may still have landed */
  }
}
