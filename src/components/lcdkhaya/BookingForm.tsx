"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

export default function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselected = searchParams.get("package");

  const [packageId, setPackageId] = useState(preselected || lcdKhayaConfig.packages[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selected = lcdKhayaConfig.packages.find((p) => p.id === packageId) || lcdKhayaConfig.packages[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/lcdkhaya/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selected.id,
          packageName: selected.name,
          packagePrice: selected.price ?? 0,
          customerName: data.get("customerName"),
          customerEmail: data.get("customerEmail"),
          customerPhone: data.get("customerPhone"),
          preferredArea: data.get("preferredArea"),
          preferredDate: data.get("preferredDate"),
          notes: data.get("notes"),
          newsletterOptIn: data.get("newsletterOptIn") === "on"
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      router.push(json.authorizationUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
      <div>
        <label htmlFor="packageId" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Package</label>
        <select
          id="packageId"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
        >
          {lcdKhayaConfig.packages.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-[#1A1A1A]/50">
          {selected.price != null ? `R${selected.price.toLocaleString("en-ZA")}` : "Pricing to be confirmed — we'll contact you with a quote before anything is charged."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="customerName" name="customerName" label="Full Name" required />
        <Field id="customerPhone" name="customerPhone" label="Phone Number" type="tel" required />
      </div>
      <Field id="customerEmail" name="customerEmail" label="Email Address" type="email" required />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredArea" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Preferred Branch</label>
          <select
            id="preferredArea"
            name="preferredArea"
            className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
          >
            {lcdKhayaConfig.branches.map((b) => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
        <Field id="preferredDate" name="preferredDate" label="Preferred Start Date" type="date" />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-[#1A1A1A]/70">
        <input type="checkbox" name="newsletterOptIn" className="h-4 w-4 accent-[#B8860B]" />
        Send me driving tips and school updates
      </label>

      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#B8860B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : selected.price != null ? "Continue to Payment" : "Request Booking"}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[#1A1A1A]">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-full border border-[#B8860B]/30 bg-white px-4 py-3 text-sm focus:border-[#B8860B] focus:outline-none"
      />
    </div>
  );
}
