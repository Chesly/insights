import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";

export const metadata: Metadata = { title: { absolute: `Privacy Policy | ${lcdKhayaConfig.shortName}` } };

export default function PrivacyPage() {
  return (
    <div>
      <PageHero title="Privacy Policy" breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Privacy Policy" }]} />
      <div className="container-page max-w-2xl py-8 text-sm text-[#1A1A1A]/70">
        <p>
          {lcdKhayaConfig.name} collects the personal information you provide when booking a lesson, subscribing
          to updates, or contacting us — including your name, email, phone number and preferred location — solely
          to provide driving lessons, process payments, and communicate with you about your booking.
        </p>
        <p className="mt-4">
          We do not sell your personal information. Payment processing is handled securely by Paystack; we do not
          store your card details. You can unsubscribe from email updates at any time.
        </p>
        <p className="mt-4">
          Questions about your information? Contact us at{" "}
          <a href={`mailto:${lcdKhayaConfig.contact.email}`} className="text-[#B8860B] hover:underline">
            {lcdKhayaConfig.contact.email}
          </a>.
        </p>
      </div>
    </div>
  );
}
