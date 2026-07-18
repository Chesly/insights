import { getAllSiteSettings } from "@/lib/settings";

// Verification meta tags only — these don't track visitors or set
// cookies, so they don't need consent gating. Clarity moved to
// TrackingScripts (consent-gated, alongside GTM).
export default async function HeadTags() {
  const s = await getAllSiteSettings();

  return (
    <>
      {s.google_search_console && (
        <meta name="google-site-verification" content={s.google_search_console} />
      )}
      {s.bing_verification && (
        <meta name="msvalidate.01" content={s.bing_verification} />
      )}
      {s.pinterest_verification && (
        <meta name="p:domain_verify" content={s.pinterest_verification} />
      )}
    </>
  );
}
