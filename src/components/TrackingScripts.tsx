import { getAllSiteSettings } from "@/lib/settings";
import ConsentManager from "./ConsentManager";

// Replaces always-on GTM/Clarity script tags. Nothing tracks the visitor
// until they've made a choice in the consent banner (POPIA/GDPR-ready) —
// see ConsentManager for the actual gating logic. The Meta Pixel ID rides
// along the same env-var convention as GA4/Clarity (see Analytics.tsx and
// .env.example) rather than a CMS setting, since it's an ad account
// credential Chesly sets per deployment, not editorial content.
export default async function TrackingScripts() {
  const s = await getAllSiteSettings();
  return (
    <ConsentManager
      gtmId={s.google_tag_manager}
      clarityId={s.microsoft_clarity}
      metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
    />
  );
}
