import Script from "next/script";
import { getSiteSetting } from "@/lib/settings";

/**
 * Google Tag Manager. Configured from the CMS (Settings → Tracking &
 * Analytics) — no redeploy needed when the Container ID changes.
 * <GoogleTagManagerHead /> goes in <head>, <GoogleTagManagerBody /> goes
 * immediately after the opening <body> tag, per Google's install instructions.
 */
export async function GoogleTagManagerHead() {
  const gtmId = await getSiteSetting("google_tag_manager");
  if (!gtmId) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `}
    </Script>
  );
}

export async function GoogleTagManagerBody() {
  const gtmId = await getSiteSetting("google_tag_manager");
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
