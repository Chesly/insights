import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSiteSettings();
  const title = settings.meta_default_title || `${siteConfig.name} — ${siteConfig.tagline}`;
  const description = settings.meta_default_description || siteConfig.shortDescription;

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s — ${siteConfig.name}` },
    description,
    openGraph: {
      type: "website",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title,
      description,
      images: settings.meta_default_og_image ? [{ url: settings.meta_default_og_image }] : undefined,
    },
    icons: { icon: siteConfig.logo },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAllSiteSettings();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    email: settings.contact_email,
    contactPoint: {
      "@type": "ContactPoint",
      email: settings.contact_email,
      telephone: settings.contact_phone,
      areaServed: "ZA",
      contactType: "customer service",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.contact_address || siteConfig.address,
      addressCountry: "ZA",
    },
    sameAs: [settings.social_facebook, settings.social_instagram, settings.social_x].filter(Boolean),
  };

  return (
    <html lang="en-ZA" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-white text-[#0F3D3E]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[#D9A62E] focus:px-4 focus:py-2 focus:text-[#0F3D3E]"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
