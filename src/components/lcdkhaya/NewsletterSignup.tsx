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
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${data.get("firstName")} ${data.get("lastName")}`.trim(),
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
      <div className="container-page text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">{newsletter.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-white/80">{newsletter.description}</p>

        {submitted ? (
          <p className="mx-auto mt-6 max-w-lg bg-white/10 px-6 py-4 text-sm font-medium">{newsletter.successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-3xl flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="lcd-nl-firstname" className="sr-only">Name</label>
                <input
                  id="lcd-nl-firstname"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Name"
                  className="w-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="lcd-nl-lastname" className="sr-only">Surname</label>
                <input
                  id="lcd-nl-lastname"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Surname"
                  className="w-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="lcd-nl-email" className="sr-only">Email address</label>
                <input
                  id="lcd-nl-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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
