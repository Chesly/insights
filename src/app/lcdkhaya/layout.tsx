import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import LcdKhayaHeader from "@/components/lcdkhaya/Header";
import LcdKhayaFooter from "@/components/lcdkhaya/Footer";
import WhatsAppButton from "@/components/lcdkhaya/WhatsAppButton";

// `title: { absolute: ... }` bypasses the root layout's Insights title
// template ("%s | Chesly.Tech Insights") — LCD Khaya is a distinct brand
// and every page under here needs its own exact title, not one nested
// inside Insights'.
export const metadata: Metadata = {
  title: { absolute: lcdKhayaConfig.seo.defaultTitle },
  description: lcdKhayaConfig.seo.defaultDescription,
  keywords: lcdKhayaConfig.seo.defaultKeywords,
  alternates: { canonical: lcdKhayaConfig.url },
  openGraph: {
    type: "website",
    locale: lcdKhayaConfig.locale,
    url: lcdKhayaConfig.url,
    siteName: lcdKhayaConfig.name,
    title: lcdKhayaConfig.seo.defaultTitle,
    description: lcdKhayaConfig.seo.defaultDescription
  }
};

function drivingSchoolSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    "@id": `${lcdKhayaConfig.url}/#business`,
    name: lcdKhayaConfig.name,
    description: lcdKhayaConfig.description,
    url: lcdKhayaConfig.url,
    telephone: lcdKhayaConfig.contact.phone,
    email: lcdKhayaConfig.contact.email,
    areaServed: lcdKhayaConfig.contact.serviceAreas,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Benoni",
      addressRegion: "Gauteng",
      addressCountry: "ZA"
    }
  };
}

export default function LcdKhayaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF6EC] font-sans text-[#1A1A1A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(drivingSchoolSchema()) }}
      />
      <LcdKhayaHeader />
      <main id="main-content">{children}</main>
      <LcdKhayaFooter />
      <WhatsAppButton />
    </div>
  );
}
