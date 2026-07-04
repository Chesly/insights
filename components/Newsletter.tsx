"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const { newsletter } = siteConfig;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to a real provider (Mailchimp/ConvertKit/etc.) before launch.
    setSubmitted(true);
  }

  return (
    <section className="w-full bg-gradient-to-br from-navy-light to-navy px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">{newsletter.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-white/70">{newsletter.description}</p>

        {submitted ? (
          <p className="mt-8 rounded-xl bg-white/10 px-6 py-4 text-sm font-medium text-white">
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
                type="text"
                required
                placeholder={newsletter.fields.name.placeholder}
                className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="text-left">
              <label htmlFor="nl-email" className="sr-only">
                {newsletter.fields.email.label}
              </label>
              <input
                id="nl-email"
                type="email"
                required
                placeholder={newsletter.fields.email.placeholder}
                className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="text-left">
              <label htmlFor="nl-phone" className="sr-only">
                {newsletter.fields.phone.label}
              </label>
              <input
                id="nl-phone"
                type="tel"
                placeholder={newsletter.fields.phone.placeholder}
                className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="text-left">
              <label htmlFor="nl-business" className="sr-only">
                {newsletter.fields.business.label}
              </label>
              <input
                id="nl-business"
                type="text"
                placeholder={newsletter.fields.business.placeholder}
                className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              className="col-span-full mt-1 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {newsletter.submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
