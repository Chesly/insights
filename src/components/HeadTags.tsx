import Script from "next/script";
import { getAllSiteSettings } from "@/lib/settings";

// Verification meta tags + Microsoft Clarity, all configured from the CMS
// (Settings → SEO / Tracking). Each renders only if its value is set —
// no empty tags cluttering the page source.
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

      {s.microsoft_clarity && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${s.microsoft_clarity}");
          `}
        </Script>
      )}
    </>
  );
}
