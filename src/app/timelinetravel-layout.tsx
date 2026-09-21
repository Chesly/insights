import type { Metadata } from "next";
import Header from "@/components/timelinetravel/Header";
import Footer from "@/components/timelinetravel/Footer";
import WhatsAppButton from "@/components/timelinetravel/WhatsAppButton";
import { getAllSiteSettings } from "@/lib/settings";
import { timelineTravelSiteConfig } from "@/lib/timelinetravel/site";

export async function timelineTravelMetadata(): Promise<Metadata> {
  const settings = await getAllSiteSettings();
  const title = settings.meta_default_title || `${timelineTravelSiteConfig.name} — ${timelineTravelSiteConfig.tagline}`;
  const description = settings.meta_default_description || timelineTravelSiteConfig.shortDescription;

  return {
    metadataBase: new URL(timelineTravelSiteConfig.url),
    title: { default: title, template: `%s — ${timelineTravelSiteConfig.name}` },
    description,
    openGraph: {
      type: "website",
      url: timelineTravelSiteConfig.url,
      siteName: timelineTravelSiteConfig.name,
      title,
      description,
      images: settings.meta_default_og_image ? [{ url: settings.meta_default_og_image }] : undefined,
    },
    icons: { icon: timelineTravelSiteConfig.logo },
    robots: { index: true, follow: true },
  };
}

export default async function TimelineTravelRootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAllSiteSettings();

  // Written directly rather than reusing lib/schema.ts's organizationSchema(),
  // which reads from Insights' own siteConfig — keeping this self-contained
  // avoids touching a shared file both sites depend on.
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: timelineTravelSiteConfig.name,
    url: timelineTravelSiteConfig.url,
    logo: `${timelineTravelSiteConfig.url}${timelineTravelSiteConfig.logo}`,
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
      streetAddress: settings.contact_address || timelineTravelSiteConfig.address,
      addressCountry: "ZA",
    },
    sameAs: [settings.social_facebook, settings.social_instagram, settings.social_x].filter(Boolean),
  };

  return (
    <html lang="en-ZA" className="scroll-smooth timelinetravel-root">
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
