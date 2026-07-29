"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

export default function Newsletter({
  noteBody,
  noteSignature,
}: {
  /** Optional short note shown above the title — e.g. the former homepage
      Editor's Note, reused here so that content isn't lost, just relocated. */
  noteBody?: string;
  noteSignature?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { newsletter } = siteConfig;

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
          phone: data.get("phone"),
          business: data.get("business"),
          source: "website",
        }),
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
    <section className="w-full bg-gradient-to-br from-navy-light to-navy px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        {noteBody && (
          <p className="mx-auto mb-6 max-w-2xl border-b border-white/10 pb-6 font-serif text-base italic leading-relaxed text-white/70">
            {noteBody}
            {noteSignature && <span className="mt-2 block text-sm not-italic text-white/50">— {noteSignature}</span>}
          </p>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl">{newsletter.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-white/70">{newsletter.description}</p>

        {submitted ? (
          <p className="mt-8 bg-white/10 px-6 py-4 text-sm font-medium text-white">
            {newsletter.successMessage}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="text-left">
              <label htmlFor="nl-name" className="sr-only">
                {newsletter.fields.name.label}
              </label>
              <input
                id="nl-name"
                name="name"
                type="text"
                required
                placeholder={newsletter.fields.name.placeholder}
                className="w-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="text-left">
              <label htmlFor="nl-email" className="sr-only">
                {newsletter.fields.email.label}
              </label>
              <input
                id="nl-email"
                name="email"
                type="email"
                required
                placeholder={newsletter.fields.email.placeholder}
                className="w-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="text-left">
              <label htmlFor="nl-phone" className="sr-only">
                {newsletter.fields.phone.label}
              </label>
              <input
                id="nl-phone"
                name="phone"
                type="tel"
                placeholder={newsletter.fields.phone.placeholder}
                className="w-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="text-left">
              <label htmlFor="nl-business" className="sr-only">
                {newsletter.fields.business.label}
              </label>
              <input
                id="nl-business"
                name="business"
                type="text"
                placeholder={newsletter.fields.business.placeholder}
                className="w-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            {error && (
              <p className="col-span-full text-left text-sm font-medium text-red-300" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="col-span-full mt-1 bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Subscribing…" : newsletter.submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
