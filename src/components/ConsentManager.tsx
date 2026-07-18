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
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: "#0f172a", color: "#e2e8f0", padding: "18px 20px",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16,
        justifyContent: "center", fontFamily: "Inter, sans-serif",
      }}
    >
      <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 560, margin: 0, flex: "1 1 320px" }}>
        We use cookies for analytics to understand how visitors use this site. Essential site
        functions work regardless of your choice. See our privacy practices for details.
      </p>

      {showPreferences ? (
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, opacity: 0.6 }}>
            <input type="checkbox" checked disabled /> Necessary (always on)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, cursor: "pointer" }}>
            <input type="checkbox" checked={analyticsToggle} onChange={(e) => setAnalyticsToggle(e.target.checked)} />
            Analytics
          </label>
          <button onClick={savePreferences} style={btnStyle("#8B6914", "#fff")}>Save Preferences</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setShowPreferences(true)} style={btnStyle("transparent", "#e2e8f0", "1px solid #334155")}>
            Preferences
          </button>
          <button onClick={rejectNonEssential} style={btnStyle("transparent", "#e2e8f0", "1px solid #334155")}>
            Reject Non-Essential
          </button>
          <button onClick={acceptAll} style={btnStyle("#8B6914", "#fff")}>
            Accept
          </button>
        </div>
      )}
    </div>
  );
}

function btnStyle(bg: string, color: string, border?: string): React.CSSProperties {
  return {
    background: bg, color, border: border || "none", padding: "9px 18px",
    borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  };
}
