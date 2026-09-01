"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function TestimonialSubmitForm() {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/public/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: "lcdkhaya",
          name: data.get("name"),
          email: data.get("email"),
          rating,
          content: data.get("content")
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-[#B8860B]/20 bg-[#B8860B]/5 p-8 text-center">
        <p className="text-sm text-[#1A1A1A]/80">
          Thank you! Your testimonial has been submitted and will appear on the site once reviewed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="t-name" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Full Name</label>
          <input id="t-name" name="name" type="text" required className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none" />
        </div>
        <div>
          <label htmlFor="t-email" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Email Address</label>
          <input id="t-email" name="email" type="email" required className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none" />
          <p className="mt-1 text-xs text-[#1A1A1A]/40">Never published — for verification only.</p>
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Your Rating</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className="p-1"
            >
              <Star className={`h-6 w-6 ${n <= rating ? "fill-[#B8860B] text-[#B8860B]" : "text-[#B8860B]/25"}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="t-content" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Your Testimonial</label>
        <textarea
          id="t-content"
          name="content"
          rows={5}
          required
          maxLength={3000}
          placeholder="Tell us about your experience learning with LCD Khaya..."
          className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
        />
      </div>

      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#B8860B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Testimonial"}
      </button>
    </form>
  );
}
