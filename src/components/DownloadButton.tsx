"use client";

import { useState } from "react";

export default function DownloadButton({
  id,
  fileUrl,
  label,
  isPremium = false,
}: {
  id: string;
  fileUrl: string;
  label: string;
  isPremium?: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const proceedToFile = () => {
    fetch(`/api/public/downloads/${id}/track`, { method: "POST" }).catch(() => {});
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleFreeClick = () => proceedToFile();

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`/api/public/downloads/${id}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, whatsapp }),
      });
      if (!res.ok) throw new Error();
      proceedToFile();
      setShowForm(false);
      setFirstName(""); setLastName(""); setEmail(""); setWhatsapp("");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  if (!isPremium) {
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
          aria-label="Get access"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-sm bg-white p-6 dark:bg-navy"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-navy dark:text-white">Get instant access</h3>
            <p className="mt-1 text-sm text-navy/60 dark:text-white/60">
              This is a premium download — just a few details and it&apos;s yours.
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

              <div className="flex gap-2 pt-2">
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
                  {status === "sending" ? "Please wait…" : "Get Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
