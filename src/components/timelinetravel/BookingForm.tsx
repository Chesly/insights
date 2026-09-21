"use client";

import { useState } from "react";
import type { Tour, TourPriceTier } from "@/lib/timelinetravel/tours";

// Redirects the browser to PayFast by building a real <form> and
// submitting it — PayFast's process endpoint only accepts a POST with
// its signed fields, not a GET/fetch redirect.
function redirectToPayfast(processUrl: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = processUrl;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export default function BookingForm({ tour }: { tour: Tour }) {
  const [tierId, setTierId] = useState<string>(tour.priceTiers[0]?.id || "");
  const [travellers, setTravellers] = useState(tour.minPax || 1);
  const [status, setStatus] = useState<"idle" | "loading" | "redirecting" | "error">("idle");

  const selectedTier: TourPriceTier | undefined = tour.priceTiers.find((t) => t.id === tierId) || tour.priceTiers[0];
  const total = selectedTier ? selectedTier.pricePerPerson * travellers : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      // Step 1: create the pending booking (its own, separate write).
      const bookingRes = await fetch("/api/timelinetravel/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          priceTierId: selectedTier?.id || null,
          travelStartDate: form.get("travelStartDate"),
          travellersCount: travellers,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          specialRequirements: form.get("specialRequirements"),
          notes: form.get("notes"),
          amount: total,
          currency: selectedTier?.currency || "ZAR",
        }),
      });
      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        setStatus("error");
        return;
      }

      // Step 2: initiate payment for that booking — a separate call, so
      // the booking exists (and is visible to Andrew) even if PayFast
      // itself is unreachable right now.
      const checkoutRes = await fetch("/api/timelinetravel/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingReference: bookingData.bookingReference }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        setStatus("error");
        return;
      }

      setStatus("redirecting");
      redirectToPayfast(checkoutData.processUrl, checkoutData.fields);
    } catch {
      setStatus("error");
    }
  }

  if (status === "redirecting") {
    return (
      <div id="book" className="border border-[#0F3D3E]/10 bg-[#FAF8F3] p-8">
        <h3 className="text-lg font-bold text-[#0F3D3E]">Redirecting to PayFast...</h3>
        <p className="mt-2 text-sm text-[#0F3D3E]/70">
          Your booking has been saved. You&apos;re being redirected to PayFast to complete payment — please don&apos;t
          close this window.
        </p>
      </div>
    );
  }

  return (
    <form id="book" onSubmit={handleSubmit} className="space-y-4 border border-[#0F3D3E]/10 p-6">
      <h3 className="text-lg font-bold text-[#0F3D3E]">Book This Tour</h3>

      {tour.priceTiers.length > 1 && (
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Room Type</span>
          <select
            value={tierId}
            onChange={(e) => setTierId(e.target.value)}
            className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
          >
            {tour.priceTiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tierName} — {t.currency} {t.pricePerPerson.toLocaleString("en-ZA")} pp
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Preferred Travel Date</span>
          <input
            name="travelStartDate"
            type="date"
            required
            className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Travellers</span>
          <input
            type="number"
            min={tour.minPax || 1}
            value={travellers}
            onChange={(e) => setTravellers(Number(e.target.value))}
            className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Name *</span>
          <input name="name" required className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Email *</span>
          <input name="email" type="email" required className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Phone *</span>
        <input name="phone" type="tel" required className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#0F3D3E]">Special Requirements</span>
        <textarea name="specialRequirements" rows={2} className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none" />
      </label>

      {total != null && (
        <p className="border-t border-black/5 pt-4 text-sm font-bold text-[#0F3D3E]">
          Total: {selectedTier?.currency} {total.toLocaleString("en-ZA")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !tour.priceTiers.length}
        className="w-full bg-[#D9A62E] px-6 py-3 text-sm font-bold text-[#0F3D3E] disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Book Now"}
      </button>
      {status === "error" && <p className="text-sm text-red-600">Something went wrong — please try again.</p>}
      {!tour.priceTiers.length && (
        <p className="text-sm text-[#0F3D3E]/50">Pricing for this tour hasn&apos;t been added yet — contact us to book.</p>
      )}
    </form>
  );
}
