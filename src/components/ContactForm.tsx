"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
      source_page: typeof window !== "undefined" ? window.location.pathname : "/contact",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-gold/30 bg-gold/5 px-6 py-8 text-center lg:col-span-2">
        <p className="text-lg font-semibold text-navy dark:text-white">Message sent — thank you.</p>
        <p className="mt-2 text-sm text-navy/70 dark:text-white/70">
          We&apos;ve received your message and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-navy dark:text-white">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="w-full border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-navy dark:text-white">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-navy dark:text-white">
          Phone <span className="font-normal text-navy/50 dark:text-white/50">(optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          className="w-full border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-navy dark:text-white">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className="w-full border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-gold px-6 py-3 font-semibold text-white hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
