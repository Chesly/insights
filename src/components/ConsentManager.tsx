"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ct_cookie_consent";

type Consent = "granted" | "rejected" | null;

function injectScript(id: string, src: string, extraAttrs?: Record<string, string>) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  if (extraAttrs) Object.entries(extraAttrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function injectTracking(gtmId?: string, clarityId?: string) {
  if (gtmId && !document.getElementById("gtm-script")) {
    const s = document.createElement("script");
    s.id = "gtm-script";
    s.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(s);
  }
  if (clarityId && !document.getElementById("clarity-script")) {
    const s = document.createElement("script");
    s.id = "clarity-script";
    s.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`;
    document.head.appendChild(s);
  }
}

export default function ConsentManager({
  gtmId,
  clarityId,
}: {
  gtmId?: string;
  clarityId?: string;
}) {
  const [consent, setConsent] = useState<Consent>(null);
  const [checked, setChecked] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" || stored === "rejected") {
      setConsent(stored);
      if (stored === "granted") injectTracking(gtmId, clarityId);
    }
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked || consent) return null;
  if (!gtmId && !clarityId) return null; // nothing to ask consent for

  const acceptAll = () => {
    localStorage.setItem(STORAGE_KEY, "granted");
    setConsent("granted");
    injectTracking(gtmId, clarityId);
  };

  const rejectNonEssential = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setConsent("rejected");
  };

  const savePreferences = () => {
    if (analyticsToggle) acceptAll();
    else rejectNonEssential();
    setShowPreferences(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[9999] flex flex-wrap items-center justify-center gap-4 border-t border-white/10 bg-footer px-5 py-4 shadow-[0_-6px_20px_rgba(0,0,0,0.35)]"
    >
      <p className="m-0 max-w-[560px] flex-1 basis-80 text-[13px] leading-relaxed text-white/60">
        We use cookies for analytics to understand how visitors use this site. Essential site
        functions work regardless of your choice. See our privacy practices for details.
      </p>

      {showPreferences ? (
        <div className="flex flex-wrap items-center gap-3.5">
          <label className="flex items-center gap-1.5 text-xs text-white/40">
            <input type="checkbox" checked disabled /> Necessary (always on)
          </label>
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-white/70">
            <input type="checkbox" checked={analyticsToggle} onChange={(e) => setAnalyticsToggle(e.target.checked)} />
            Analytics
          </label>
          <button
            onClick={savePreferences}
            className="whitespace-nowrap bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold-light"
          >
            Save Preferences
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowPreferences(true)}
            className="whitespace-nowrap border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Preferences
          </button>
          <button
            onClick={rejectNonEssential}
            className="whitespace-nowrap border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={acceptAll}
            className="whitespace-nowrap bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold-light"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
