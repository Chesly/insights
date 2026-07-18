import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import Analytics from "@/components/Analytics";
import TrackingScripts from "@/components/TrackingScripts";
import HeadTags from "@/components/HeadTags";
import CustomHeadCode from "@/components/CustomHeadCode";
import CustomFooterCode from "@/components/CustomFooterCode";
import { siteConfig } from "@/lib/siteConfig";
import { organizationSchema, websiteSchema } from "@/lib/schema";

// Without this, Next.js treats the whole layout as static and freezes it
// at build time — meaning settings-driven content (the consent banner,
// custom head/footer code) would only ever reflect whatever was saved
// at the moment of the last deploy, not what's actually in the CMS now.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate
  },
  description: siteConfig.seo.defaultDescription,
  keywords: siteConfig.seo.defaultKeywords,
  authors: [{ name: siteConfig.owner.name, url: siteConfig.owner.url }],
  creator: siteConfig.owner.name,
  publisher: siteConfig.shortName,
  icons: {
    icon: siteConfig.branding.favicon,
    shortcut: siteConfig.branding.favicon,
    apple: siteConfig.branding.favicon
  },
  manifest: `${siteConfig.url}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: `${siteConfig.url}/opengraph-image`, width: 1200, height: 630, alt: siteConfig.name }]
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.seo.twitterHandle,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image`]
  },
  alternates: {
    canonical: siteConfig.url,
    types: { "application/rss+xml": `${siteConfig.url}/rss.xml` }
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href={siteConfig.branding.favicon} />
        <HeadTags />
        <CustomHeadCode />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body>
        <TrackingScripts />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <CustomFooterCode />
      </body>
    </html>
  );
}
