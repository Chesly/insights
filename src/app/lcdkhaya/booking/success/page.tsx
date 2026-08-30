"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/lcdkhaya/PageHero";

type VerifyState =
  | { status: "loading" }
  | { status: "confirmed" }
  | { status: "lead" }
  | { status: "failed" }
  | { status: "error"; message: string };

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <BookingSuccessContent />
    </Suspense>
  );
}

function Fallback() {
  return (
    <div>
      <PageHero title="Booking Confirmation" breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Booking", href: "/lcdkhaya/booking" }, { label: "Confirmation" }]} />
      <div className="container-page py-10 text-center text-sm text-[#1A1A1A]/60">Confirming your booking…</div>
    </div>
  );
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const isLead = searchParams.get("lead") === "1";
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    if (!reference) {
      setState({ status: "error", message: "No booking reference was provided." });
      return;
    }
    if (isLead) {
      setState({ status: "lead" });
      return;
    }
    fetch(`/api/lcdkhaya/booking/verify?reference=${encodeURIComponent(reference)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Something went wrong.");
        setState(json.status === "confirmed" ? { status: "confirmed" } : { status: "failed" });
      })
      .catch((err) => setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong." }));
  }, [reference, isLead]);

  return (
    <div>
      <PageHero title="Booking Confirmation" breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Booking", href: "/lcdkhaya/booking" }, { label: "Confirmation" }]} />
      <div className="container-page py-10 text-center">
        <div className="mx-auto max-w-md">
          {state.status === "loading" && <p className="text-sm text-[#1A1A1A]/60">Confirming your booking…</p>}
          {state.status === "confirmed" && (
            <>
              <h1 className="text-xl font-bold text-[#1A1A1A]">Booking Confirmed 🎉</h1>
              <p className="mt-2 text-sm text-[#1A1A1A]/60">We've received your payment and will be in touch to schedule your first lesson.</p>
            </>
          )}
          {state.status === "lead" && (
            <>
              <h1 className="text-xl font-bold text-[#1A1A1A]">Request Received</h1>
              <p className="mt-2 text-sm text-[#1A1A1A]/60">Thanks — we've received your booking request and will contact you shortly to confirm details and arrange payment.</p>
            </>
          )}
          {state.status === "failed" && (
            <>
              <h1 className="text-xl font-bold text-[#1A1A1A]">Payment Not Completed</h1>
              <p className="mt-2 text-sm text-[#1A1A1A]/60">Your booking wasn't confirmed. Please try again or contact us directly.</p>
            </>
          )}
          {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
          <Link href="/lcdkhaya" className="mt-4 inline-block bg-[#B8860B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8B6E46]">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
