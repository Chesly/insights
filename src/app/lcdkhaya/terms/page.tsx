import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";

export const metadata: Metadata = { title: { absolute: `Terms of Use | ${lcdKhayaConfig.shortName}` } };

export default function TermsPage() {
  return (
    <div>
      <PageHero title="Terms of Use" breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Terms of Use" }]} />
      <div className="container-page max-w-2xl py-6 text-sm text-[#1A1A1A]/70">
        <p>
          These terms govern your use of the {lcdKhayaConfig.name} website and booking of lessons or packages
          through it. By booking a lesson, you agree to attend at the scheduled time or provide reasonable notice
          of cancellation.
        </p>
        <p className="mt-4">
          Lesson packages and pricing are confirmed directly with {lcdKhayaConfig.shortName} at the time of
          booking. Full terms specific to cancellations, rescheduling and refunds will be provided here once
          finalised — contact us at{" "}
          <a href={`mailto:${lcdKhayaConfig.contact.email}`} className="text-[#B8860B] hover:underline">
            {lcdKhayaConfig.contact.email}
          </a>{" "}
          with any questions in the meantime.
        </p>
      </div>
    </div>
  );
}
