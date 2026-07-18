import { getAllSiteSettings } from "@/lib/settings";
import ConsentManager from "./ConsentManager";

// Replaces always-on GTM/Clarity script tags. Nothing tracks the visitor
// until they've made a choice in the consent banner (POPIA/GDPR-ready) —
// see ConsentManager for the actual gating logic.
export default async function TrackingScripts() {
  const s = await getAllSiteSettings();
  return <ConsentManager gtmId={s.google_tag_manager} clarityId={s.microsoft_clarity} />;
}
