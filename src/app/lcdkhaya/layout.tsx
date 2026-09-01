import type { Metadata } from "next";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import LcdKhayaHeader from "@/components/lcdkhaya/Header";
import LcdKhayaFooter from "@/components/lcdkhaya/Footer";
import WhatsAppButton from "@/components/lcdkhaya/WhatsAppButton";
import BackToTopButton from "@/components/lcdkhaya/BackToTopButton";

// Matches the font pairing used across Chesly's other sites (e.g. Nikson
// M): Playfair Display for headings, Inter for body copy, IBM Plex Mono
// for small labels/eyebrows/stats — scoped to LCD Khaya via CSS
// variables rather than touching the root Insights font stack.
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-lcd-serif" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-lcd-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-lcd-mono" });

// `title: { absolute: ... }` bypasses the root layout's Insights title
// template ("%s | Chesly.Tech Insights") — LCD Khaya is a distinct brand
// and every page under here needs its own exact title, not one nested
// inside Insights'.
export const metadata: Metadata = {
  title: { absolute: lcdKhayaConfig.seo.defaultTitle },
  description: lcdKhayaConfig.seo.defaultDescription,
  keywords: lcdKhayaConfig.seo.defaultKeywords,
  alternates: { canonical: lcdKhayaConfig.url },
  icons: {
    icon: lcdKhayaConfig.branding.favicon,
    shortcut: lcdKhayaConfig.branding.favicon,
    apple: lcdKhayaConfig.branding.favicon
  },
  openGraph: {
    type: "website",
    locale: lcdKhayaConfig.locale,
    url: lcdKhayaConfig.url,
    siteName: lcdKhayaConfig.name,
    title: lcdKhayaConfig.seo.defaultTitle,
    description: lcdKhayaConfig.seo.defaultDescription
  }
};

// Three branches, one business — each branch is modeled as a `department`
// (a LocalBusiness in its own right, per schema.org's multi-location
// pattern) rather than jamming multiple addresses onto a single `address`
// field, which only accepts one PostalAddress.
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
    foundingDate: String(lcdKhayaConfig.foundedYear),
    areaServed: lcdKhayaConfig.branches.map((b) => b.name),
    sameAs: lcdKhayaConfig.social.map((s) => s.href),
    // Office hours — actual lesson availability is broader (see
    // lessonScheduleNote), but openingHoursSpecification is meant to
    // describe when the business can be reached, which is the office.
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "14:00" }
    ],
    department: lcdKhayaConfig.branches.map((b) => ({
      "@type": "DrivingSchool",
      name: `${lcdKhayaConfig.name} — ${b.name}`,
      telephone: b.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: b.addressLines.join(", "),
        addressLocality: b.name,
        postalCode: b.postalCode,
        addressRegion: "Gauteng",
        addressCountry: "ZA"
      }
    }))
  };
}

export default function LcdKhayaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${inter.variable} ${plexMono.variable} lcdkhaya-root min-h-screen bg-[#FAF6EC] font-[family-name:var(--font-lcd-sans)] text-[#1A1A1A]`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(drivingSchoolSchema()) }}
      />
      <LcdKhayaHeader />
      <main id="main-content">{children}</main>
      <LcdKhayaFooter />
      <WhatsAppButton />
      <BackToTopButton />
    </div>
  );
}
