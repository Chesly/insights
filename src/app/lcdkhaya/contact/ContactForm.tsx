"use client";

import { useState } from "react";

export default function ContactForm() {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
          source_page: "/lcdkhaya/contact"
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
      <div className="border border-[#B8860B]/20 bg-[#B8860B]/5 p-6 text-sm text-[#1A1A1A]/80">
        Thanks — we've received your message and will get back to you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Name</label>
          <input id="contact-name" name="name" type="text" required className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Phone</label>
          <input id="contact-phone" name="phone" type="tel" className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Email</label>
        <input id="contact-email" name="email" type="email" required className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none" />
      </div>
      <div>
        <label htmlFor="contact-subject" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Subject</label>
        <input id="contact-subject" name="subject" type="text" className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none" />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Message</label>
        <textarea id="contact-message" name="message" rows={5} required className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none" />
      </div>
      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#B8860B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
