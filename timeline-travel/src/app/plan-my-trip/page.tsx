import type { Metadata } from "next";
import PlanMyTripForm from "@/components/PlanMyTripForm";

export const metadata: Metadata = {
  title: "Plan Your Trip",
  description: "Tell us what you're looking for and we'll help create a journey around your needs.",
};

export default function PlanMyTripPage() {
  return (
    <div className="container-page py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E]">Custom Trip</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">Plan Your Trip</h1>
      <p className="mt-3 max-w-xl text-sm text-[#0F3D3E]/60">
        Tell us what you&apos;re looking for and we&apos;ll help create a journey around your needs.
      </p>
      <div className="mt-10">
        <PlanMyTripForm />
      </div>
    </div>
  );
}
