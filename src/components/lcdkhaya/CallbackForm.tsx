"use client";

import { useState } from "react";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

// Lighter-weight than the full ContactForm — just enough for someone to
// say "call me" without picking a package or writing a message first.
// Posts to the same /api/contact endpoint the full contact form uses,
// tagged with a fixed subject so callback requests are easy to spot in
// the admin panel's contact messages list.
export default function CallbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { callback } = lcdKhayaConfig;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const query = String(data.get("query") || "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: "Callback Request",
          message: query || "Please call me back regarding driving lessons.",
          source_page: "/lcdkhaya/callback"
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

  return (
    <section className="border border-[#B8860B]/20 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-bold text-[#1A1A1A]">{callback.title}</h2>
      <p className="mt-1 text-sm text-[#1A1A1A]/60">{callback.description}</p>

      {submitted ? (
        <p className="mt-5 bg-[#B8860B]/10 px-4 py-3 text-sm text-[#1A1A1A]/80">{callback.successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="cb-name" className="sr-only">Full name</label>
            <input
              id="cb-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="cb-phone" className="sr-only">Phone number</label>
            <input
              id="cb-phone"
              name="phone"
              type="tel"
              required
              placeholder="Phone number"
              className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cb-email" className="sr-only">Email address</label>
            <input
              id="cb-email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cb-query" className="sr-only">What would you like to know?</label>
            <input
              id="cb-query"
              name="query"
              type="text"
              placeholder="What would you like to know? (optional)"
              className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600 sm:col-span-2" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#B8860B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
          >
            {submitting ? "Submitting…" : "Request a Callback"}
          </button>
        </form>
      )}
    </section>
  );
}
