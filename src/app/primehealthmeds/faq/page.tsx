import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import PageHero from "@/components/primehealthmeds/PageHero";
import FaqAccordion from "@/components/primehealthmeds/FaqAccordion";

export const metadata: Metadata = { title: { absolute: `FAQ | ${cfg.shortName}` } };

function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cfg.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export default function PrimeHealthMedsFaqPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }} />
      <PageHero title="Frequently Asked Questions" breadcrumbs={[{ label: "Home", href: "/primehealthmeds" }, { label: "FAQ" }]} />
      <div className="container-page max-w-2xl py-10">
        <FaqAccordion faqs={cfg.faqs} />
        <p className="mt-6 text-center text-sm text-[#111827]/50">
          Still have questions?{" "}
          <a href="/primehealthmeds/contact" className="font-semibold text-[#0f766e] hover:underline">Get in touch</a>.
        </p>
      </div>
    </div>
  );
}
