"use client";

import { useState } from "react";

const TRAVEL_TYPES = [
  "Leisure Travel", "Corporate Travel", "Group Travel", "Business Travel",
  "MICE / Events", "Adventure Travel", "Family Travel", "Honeymoon", "Wildlife", "Other",
];

export default function PlanMyTripForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch("/api/trip-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          destination: form.get("destination"),
          preferredDates: form.get("preferredDates"),
          travellersCount: form.get("travellersCount"),
          travelType: form.get("travelType"),
          budgetRange: form.get("budgetRange"),
          accommodationRequirements: form.get("accommodationRequirements"),
          transportRequirements: form.get("transportRequirements"),
          specialRequests: form.get("specialRequests"),
          notes: form.get("notes"),
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
        <p className="font-semibold text-[#0F3D3E]">Thanks — your trip request has been received.</p>
        <p className="mt-1 text-sm text-[#0F3D3E]/60">Timeline Travel will be in touch to help plan your journey.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" required />
        <Field label="Destination" name="destination" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred Travel Dates" name="preferredDates" placeholder="e.g. mid-March 2027" />
        <Field label="Number of Travellers" name="travellersCount" type="number" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Travel Type</span>
          <select
            name="travelType"
            defaultValue=""
            className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
          >
            <option value="">Select...</option>
            {TRAVEL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <Field label="Budget Range" name="budgetRange" placeholder="e.g. R15,000 – R25,000 pp" />
      </div>
      <Field label="Accommodation Requirements" name="accommodationRequirements" />
      <Field label="Transport Requirements" name="transportRequirements" />
      <TextArea label="Special Requests" name="specialRequests" />
      <TextArea label="Additional Information" name="notes" />

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#D9A62E] px-6 py-3 text-sm font-bold text-[#0F3D3E] disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Request My Trip"}
      </button>
      {status === "error" && <p className="text-sm text-red-600">Something went wrong — please try again.</p>}
    </form>
  );
}

function Field({
  label, name, type = "text", required = false, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">
        {label} {required && "*"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] placeholder:text-[#0F3D3E]/30 focus:border-[#D9A62E] focus:outline-none"
      />
    </label>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">{label}</span>
      <textarea
        name={name}
        rows={3}
        className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
      />
    </label>
  );
}
