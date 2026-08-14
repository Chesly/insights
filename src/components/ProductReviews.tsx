"use client";

import { useState } from "react";
import type { PublicReview } from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-navy/20 dark:text-white/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ProductReviews({
  downloadId,
  reviews,
}: {
  downloadId: string;
  reviews: PublicReview[];
}) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`/api/public/downloads/${downloadId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, rating, content }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      setShowForm(false);
      setName(""); setEmail(""); setContent(""); setRating(5);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="mt-3 border-t border-navy/10 dark:border-white/10">
      {/* Tab-style header — matches the "DESCRIPTION | REVIEWS" pattern from
          the confirmed reference; reviews stay collapsed until clicked. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-wide text-navy dark:text-white"
      >
        Reviews ({reviews.length})
        <span aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="pb-8">
          {status === "sent" && (
            <p className="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Thanks — your review has been submitted and will appear once approved.
            </p>
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-navy/50 dark:text-white/50">No reviews yet — be the first.</p>
          ) : (
            <ul className="space-y-5">
              {reviews.map((r) => (
                <li key={r.id} className="border-b border-navy/5 pb-5 last:border-0 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Stars rating={r.rating} />
                    <span className="text-sm font-semibold text-navy dark:text-white">{r.authorName}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/70 dark:text-white/70">{r.content}</p>
                </li>
              ))}
            </ul>
          )}

          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 border border-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gold hover:bg-gold hover:text-white"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 max-w-md space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy/70 dark:text-white/70">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className={`text-2xl leading-none ${n <= rating ? "text-gold" : "text-navy/20 dark:text-white/20"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <input
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <textarea
                required
                rows={4}
                placeholder="Your review"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              {status === "error" && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
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
                  {status === "sending" ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
