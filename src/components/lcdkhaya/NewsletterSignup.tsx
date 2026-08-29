"use client";

import { useState } from "react";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

export default function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { newsletter } = lcdKhayaConfig;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.get("name"),
          email: data.get("email"),
          source: newsletter.source
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-[#8B6E46] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">{newsletter.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-white/80">{newsletter.description}</p>

        {submitted ? (
          <p className="mt-6 bg-white/10 px-6 py-4 text-sm font-medium">{newsletter.successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
            <label htmlFor="lcd-nl-name" className="sr-only">Full name</label>
            <input
              id="lcd-nl-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#D4AF37] focus:outline-none"
            />
            <label htmlFor="lcd-nl-email" className="sr-only">Email address</label>
            <input
              id="lcd-nl-email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#D4AF37] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="shrink-0 bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {error && <p className="mt-3 text-sm font-medium text-red-200">{error}</p>}
      </div>
    </section>
  );
}
