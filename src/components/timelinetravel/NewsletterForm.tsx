"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    setStatus("loading");
    try {
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "timelinetravel-website" }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm font-semibold text-[#D9A62E]">You&apos;re subscribed — thank you!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <input
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="w-full border-0 bg-white px-4 py-3 text-sm text-[#0F3D3E] placeholder:text-[#0F3D3E]/40 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 bg-[#D9A62E] px-5 py-3 text-sm font-bold text-[#0F3D3E] disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="absolute mt-14 text-xs text-red-200">Something went wrong — try again.</p>
      )}
    </form>
  );
}
