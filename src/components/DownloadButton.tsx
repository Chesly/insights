"use client";

import { useState } from "react";

type Tier = "free" | "premium" | "paid";

export default function DownloadButton({
  id,
  fileUrl,
  label,
  tier = "free",
}: {
  id: string;
  fileUrl: string;
  label: string;
  tier?: Tier;
}) {
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const handleFreeClick = () => {
    // Fire-and-forget — never let a tracking hiccup block the actual download.
    fetch(`/api/public/downloads/${id}/track`, { method: "POST" }).catch(() => {});
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Open the tab SYNCHRONOUSLY, right here, as the direct result of the
    // click — browsers silently block window.open() called after an
    // await, since by then it's no longer considered a direct response
    // to user action. Opening a blank tab now and filling in its
    // destination once the lead is saved avoids that entirely.
    const newTab = window.open("", "_blank");

    try {
      const res = await fetch(`/api/public/downloads/${id}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, whatsapp }),
      });
      if (!res.ok) throw new Error();

      fetch(`/api/public/downloads/${id}/track`, { method: "POST" }).catch(() => {});
      if (newTab) newTab.location.href = fileUrl;
      else window.open(fileUrl, "_blank", "noopener,noreferrer"); // popup fully blocked — best effort

      setShowForm(false);
      setFirstName(""); setLastName(""); setEmail(""); setWhatsapp("");
      setStatus("idle");
    } catch {
      newTab?.close();
      setStatus("error");
    }
  };

  if (tier === "paid") {
    return (
      <button
        disabled
        title="Payments are launching soon"
        className="mt-6 inline-flex items-center justify-center gap-1.5 border border-red-300 bg-red-50 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-red-400 cursor-not-allowed"
      >
        Coming Soon
      </button>
    );
  }

  if (tier !== "premium") {
    return (
      <button
        onClick={handleFreeClick}
        className="mt-6 inline-block border border-gold bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark transition-colors"
      >
        {label}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="mt-6 inline-flex items-center justify-center gap-1.5 border border-navy bg-navy px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-navy/90 transition-colors dark:border-white dark:bg-white dark:text-navy"
      >
        🔒 {label}
      </button>

      {showForm && (
        <div
          role="dialog"
          aria-label="Unlock your download"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-sm bg-white p-6 dark:bg-navy"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-navy dark:text-white">Unlock Your Download</h3>
            <p className="mt-1 text-sm text-navy/60 dark:text-white/60">
              Complete the short form below to access this premium resource. Your download will
              begin immediately after submission.
            </p>

            <form onSubmit={handleLeadSubmit} className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  required
                  placeholder="Surname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                required
                type="tel"
                placeholder="WhatsApp number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />

              {status === "error" && (
                <p className="text-sm text-red-600">Something went wrong — please try again.</p>
              )}

              <p className="text-xs text-navy/40 dark:text-white/40">
                🔒 We respect your privacy and will never share your information.
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gold/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-gold/5 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex-1 bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-dark disabled:opacity-60"
                >
                  {status === "sending" ? "Please wait…" : "Unlock Download"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
