"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { COUNTRIES } from "@/lib/countries";

type Tier = "free" | "premium" | "paid";

export default function DownloadButton({
  id,
  slug,
  name,
  price,
  thumbnailUrl,
  fileUrl,
  label,
  tier = "free",
  storeUrl,
}: {
  id: string;
  slug?: string;
  name?: string;
  price?: number;
  thumbnailUrl?: string;
  fileUrl: string;
  label: string;
  tier?: Tier;
  /** Manual external checkout link — set this on a download to bypass
      the built-in cart entirely (e.g. a Gumroad link, or a bundle sold
      elsewhere). Leave blank to use the native cart + Paystack checkout. */
  storeUrl?: string;
}) {
  const { addItem, isInCart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const [showFreeForm, setShowFreeForm] = useState(false);
  const [freeName, setFreeName] = useState("");
  const [freeEmail, setFreeEmail] = useState("");
  const [freeWhatsapp, setFreeWhatsapp] = useState("+27 ");
  const [freeCountry, setFreeCountry] = useState("South Africa");
  const [freeState, setFreeState] = useState("");
  const [freeNotes, setFreeNotes] = useState("");
  const [freeNewsletter, setFreeNewsletter] = useState(false);
  const [freeStatus, setFreeStatus] = useState<"idle" | "sending" | "error">("idle");
  const [freeError, setFreeError] = useState("");

  const handleFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFreeStatus("sending");
    setFreeError("");

    try {
      const res = await fetch(`/api/downloads/${id}/free-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: freeName, email: freeEmail, whatsapp: freeWhatsapp,
          country: freeCountry, stateProvince: freeState, notes: freeNotes,
          newsletterOptIn: freeNewsletter,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");

      // Full navigation, same confirmation page a paid order lands on —
      // no more opening the raw file in a new tab.
      window.location.href = `/checkout/success?reference=${json.reference}`;
    } catch (err) {
      setFreeStatus("error");
      setFreeError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    }
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

      // Issue a secure token rather than sending the raw fileUrl to the
      // browser — same reasoning as the Free tier flow below.
      const claimRes = await fetch("/api/downloads/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloadId: id, name: `${firstName} ${lastName}`.trim(), email }),
      });
      const claimJson = await claimRes.json();
      const target = claimRes.ok ? claimJson.downloadUrl : fileUrl; // graceful fallback, never block a paid-for lead

      if (newTab) newTab.location.href = target;
      else window.open(target, "_blank", "noopener,noreferrer"); // popup fully blocked — best effort

      setShowForm(false);
      setFirstName(""); setLastName(""); setEmail(""); setWhatsapp("");
      setStatus("idle");
    } catch {
      newTab?.close();
      setStatus("error");
    }
  };

  if (tier === "paid") {
    if (storeUrl) {
      return (
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-1.5 border border-gold bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark transition-colors"
        >
          🛒 Buy Now
        </a>
      );
    }

    // No external store link set — sell it through the built-in cart.
    if (price == null || !slug || !name) {
      return (
        <button
          disabled
          title="Set a price and slug in the admin to enable checkout"
          className="mt-6 inline-flex items-center justify-center gap-1.5 border border-red-300 bg-red-50 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-red-400 cursor-not-allowed"
        >
          Coming Soon
        </button>
      );
    }

    const inCart = isInCart(id);
    return (
      <Link
        href="/cart"
        onClick={(e) => {
          if (inCart) return; // already added — just go straight to cart
          e.preventDefault();
          addItem({ productId: id, slug, name, price, thumbnailUrl });
          window.location.href = "/cart";
        }}
        className="mt-6 inline-flex items-center justify-center gap-1.5 border border-gold bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark transition-colors"
      >
        🛒 {inCart ? "View Cart" : "Buy Now"}
      </Link>
    );
  }

  if (tier !== "premium") {
    return (
      <>
        <button
          onClick={() => setShowFreeForm(true)}
          className="mt-6 inline-block border border-gold bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark transition-colors"
        >
          {label}
        </button>

        {showFreeForm && (
          <div
            role="dialog"
            aria-label="Get your free download"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowFreeForm(false)}
          >
            <div className="w-full max-w-sm bg-white p-6 dark:bg-navy" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-navy dark:text-white">Get Your Free Download</h3>
              <p className="mt-1 text-sm text-navy/60 dark:text-white/60">
                Fill in your details below and your download will be ready on the next screen.
              </p>

              <form onSubmit={handleFreeSubmit} className="mt-5 space-y-3">
                <input
                  required
                  placeholder="e.g. Thandiwe Nkosi"
                  value={freeName}
                  onChange={(e) => setFreeName(e.target.value)}
                  className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  required
                  type="email"
                  placeholder="e.g. thandiwe@example.com"
                  value={freeEmail}
                  onChange={(e) => setFreeEmail(e.target.value)}
                  className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  required
                  type="tel"
                  placeholder="e.g. +27 82 123 4567"
                  value={freeWhatsapp}
                  onChange={(e) => setFreeWhatsapp(e.target.value)}
                  className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={freeCountry}
                    onChange={(e) => setFreeCountry(e.target.value)}
                    className="w-full border border-gold/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:bg-navy"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    placeholder="e.g. Gauteng"
                    value={freeState}
                    onChange={(e) => setFreeState(e.target.value)}
                    className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Notes (optional)"
                  value={freeNotes}
                  onChange={(e) => setFreeNotes(e.target.value)}
                  className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <label className="flex items-start gap-2 text-xs text-navy/70 dark:text-white/70">
                  <input
                    type="checkbox"
                    checked={freeNewsletter}
                    onChange={(e) => setFreeNewsletter(e.target.checked)}
                    className="mt-0.5"
                  />
                  Subscribe to our newsletter <span className="font-normal text-navy/40 dark:text-white/40">(optional)</span>
                </label>

                {freeStatus === "error" && <p className="text-sm text-red-600">{freeError}</p>}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowFreeForm(false)}
                    className="flex-1 border border-gold/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-gold/5 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={freeStatus === "sending"}
                    className="flex-1 bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-dark disabled:opacity-60"
                  >
                    {freeStatus === "sending" ? "Please wait…" : "Get Download"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
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
