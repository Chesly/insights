import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import FaqAccordion from "@/components/lcdkhaya/FaqAccordion";

export const metadata: Metadata = { title: { absolute: `FAQ | ${lcdKhayaConfig.shortName}` } };

function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lcdKhayaConfig.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
}

export default function FaqPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }} />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before booking your first lesson."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "FAQ" }]}
      />
      <div className="container-page max-w-2xl py-14">
        <FaqAccordion faqs={lcdKhayaConfig.faqs} />
        <p className="mt-6 text-center text-sm text-[#1A1A1A]/50">
          Still have questions?{" "}
          <a href="/lcdkhaya/contact" className="font-semibold text-[#B8860B] hover:underline">
            Get in touch
          </a>
          .
        </p>
      </div>
    </div>
  );
}
