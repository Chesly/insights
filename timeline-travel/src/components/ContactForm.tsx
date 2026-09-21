"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
        }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-[#0F3D3E]/10 bg-[#FAF8F3] p-8 text-center">
        <p className="font-semibold text-[#0F3D3E]">Thanks — we&apos;ve received your message.</p>
        <p className="mt-1 text-sm text-[#0F3D3E]/60">Timeline Travel will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Phone" name="phone" type="tel" />
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Message *</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#D9A62E] px-6 py-3 text-sm font-bold text-[#0F3D3E] disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && <p className="text-sm text-red-600">Something went wrong — please try again.</p>}
    </form>
  );
}

function Field({
  label, name, type = "text", required = false,
}: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">
        {label} {required && "*"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
      />
    </label>
  );
}
