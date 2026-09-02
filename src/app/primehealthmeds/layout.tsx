import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import PrimeHealthMedsHeader from "@/components/primehealthmeds/Header";
import PrimeHealthMedsFooter from "@/components/primehealthmeds/Footer";

// `title: { absolute: ... }` bypasses the root layout's Insights title
// template — Prime Health Meds is a distinct brand, same reasoning as
// LCD Khaya's layout.
export const metadata: Metadata = {
  title: { absolute: cfg.seo.defaultTitle },
  description: cfg.seo.defaultDescription,
  keywords: cfg.seo.defaultKeywords,
  alternates: { canonical: cfg.url },
  icons: { icon: cfg.branding.favicon, shortcut: cfg.branding.favicon, apple: cfg.branding.favicon },
  openGraph: {
    type: "website",
    locale: cfg.locale,
    url: cfg.url,
    siteName: cfg.name,
    title: cfg.seo.defaultTitle,
    description: cfg.seo.defaultDescription
  }
};

function pharmacySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "@id": `${cfg.url}/#business`,
    name: cfg.name,
    description: cfg.description,
    url: cfg.url,
    email: cfg.contact.email
  };
}

export default function PrimeHealthMedsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="primehealthmeds-root min-h-screen bg-white font-sans text-[#111827]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pharmacySchema()) }} />
      <PrimeHealthMedsHeader />
      <main id="main-content">{children}</main>
      <PrimeHealthMedsFooter />
    </div>
  );
}
