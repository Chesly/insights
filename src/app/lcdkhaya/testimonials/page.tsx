import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import TestimonialSubmitForm from "@/components/lcdkhaya/TestimonialSubmitForm";

export const metadata: Metadata = { title: { absolute: `Share Your Experience | ${lcdKhayaConfig.shortName}` } };

export default function TestimonialsPage() {
  return (
    <div>
      <PageHero
        title="Share Your Experience"
        subtitle="Passed your test with us? Tell other learners about it."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Share Your Experience" }]}
      />
      <div className="container-page py-14">
        <TestimonialSubmitForm />
      </div>
    </div>
  );
}
