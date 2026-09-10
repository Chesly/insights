import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import BarcodeQrGenerator from "@/components/BarcodeQrGenerator";
import ProductsTeaser from "@/components/ProductsTeaser";
import FaqAnswer from "@/components/FaqAnswer";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/schema";

const PAGE_URL = `${siteConfig.url}/calculators/barcode-qr-generator`;

export const metadata: Metadata = {
  title: "Free QR Code & Barcode Generator — CODE128, EAN-13, UPC & More",
  description:
    "Generate a QR code or barcode from any text, link or product code and download it as a PNG. Free, no signup — runs entirely in your browser, nothing is uploaded.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free QR Code & Barcode Generator",
    description: "Generate a QR code or barcode from any text, link or product code and download it as a PNG.",
    url: PAGE_URL,
    type: "website"
  },
  twitter: { card: "summary_large_image" }
};

const FAQS = [
  {
    question: "Is this QR code and barcode generator really free?",
    answer:
      "Yes. There's no signup, no watermark and no limit on how many codes you generate — the tool runs entirely in your browser tab and every PNG you download is yours to use."
  },
  {
    question: "Do my QR codes expire or stop working?",
    answer:
      "No. The QR code encodes your text or link directly — there's no shortener, redirect or third-party service in between, so the code will always work for as long as the content it points to (e.g. your website) exists."
  },
  {
    question: "Which barcode format should I use?",
    answer:
      "CODE128 is the most flexible — it accepts letters, numbers and symbols, so it's a good default for internal stock codes, invoice numbers and asset tags. EAN-13 and UPC-A are the standards used on retail products sold in stores, and require a specific number of digits assigned by GS1. CODE39 is common on older industrial and logistics systems."
  },
  {
    question: "Why does my EAN-13 or UPC-A barcode show an error?",
    answer:
      "Retail barcode formats are strict about length and check digits. EAN-13 needs 12 or 13 digits and UPC-A needs 11 or 12 — if you're assigning your own product codes for retail sale, you'll need a GS1-issued prefix rather than a random number."
  },
  {
    question: "What does the error correction level do on a QR code?",
    answer:
      "It controls how much of the code can be damaged, dirty or partially covered (e.g. with a logo) and still scan correctly — Low tolerates about 7% damage, High about 30%. Higher levels make the code slightly denser, so only increase it if the code will be printed small or overlaid with a logo."
  },
  {
    question: "Can I use these codes for commercial or retail products?",
    answer:
      "Yes for QR codes. For retail barcodes (EAN-13, UPC-A) that need to scan at a till, you'll typically need a number officially assigned through GS1 rather than one you make up yourself — check with GS1 South Africa before printing packaging at scale."
  }
];

export default function BarcodeQrGeneratorPage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Calculators", url: `${siteConfig.url}/calculators` },
    { name: "QR & Barcode Generator", url: PAGE_URL }
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webApplicationSchema({
              name: "Free QR Code & Barcode Generator",
              url: PAGE_URL,
              description: "Generate a QR code or barcode from any text, link or product code and download it as a PNG.",
              applicationCategory: "BusinessApplication",
              featureList: [
                "Generate a QR code from any text, URL or note",
                "Generate CODE128, EAN-13, EAN-8, UPC-A, CODE39, ITF-14, Codabar and Pharmacode barcodes",
                "Adjustable QR error correction level and colors",
                "Download as a PNG",
                "Instant, in-browser generation — nothing uploaded"
              ]
            })
          )
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      <PageHero
        title="Free QR Code & Barcode Generator"
        subtitle="Turn any link, text or product code into a downloadable QR code or barcode in seconds. No signup, no upload — everything runs right here in your browser."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "QR & Barcode Generator" }
        ]}
      />

      <div className="container-page py-4">
        <div className="mx-auto max-w-3xl">
          <section className="border-b border-navy/10 py-8 dark:border-white/10">
            <BarcodeQrGenerator />
          </section>

          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">QR code or barcode — which do you need?</h2>
            <div className="mt-5 space-y-4">
              <div className="border-l-2 border-navy/10 pl-4 dark:border-white/10">
                <p className="font-bold text-navy dark:text-white">QR codes</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/70 dark:text-white/60">
                  Best for links, contact details, Wi-Fi credentials or any longer piece of text a phone camera will
                  scan directly — menus, flyers, business cards, and packaging that points customers to a website.
                </p>
              </div>
              <div className="border-l-2 border-navy/10 pl-4 dark:border-white/10">
                <p className="font-bold text-navy dark:text-white">Barcodes</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/70 dark:text-white/60">
                  Best for a short code that a dedicated barcode scanner will read at a till or in a warehouse —
                  stock items, invoices, asset tags, and retail products using standard formats like EAN-13 or
                  UPC-A.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">Common questions</h2>
            <div className="mt-4 divide-y divide-gold/10 border border-gold/20">
              {FAQS.map((f, i) => (
                <details key={i} className="group p-4">
                  <summary className="cursor-pointer list-none font-medium text-navy marker:content-none dark:text-white">
                    {f.question}
                  </summary>
                  <p className="mt-2 text-sm text-navy/70 dark:text-white/70">
                    <FaqAnswer text={f.answer} />
                  </p>
                </details>
              ))}
            </div>
          </section>

          <p className="mt-10 border-t border-navy/10 pt-6 text-xs text-navy/50 dark:border-white/10 dark:text-white/40">
            Retail barcode formats (EAN-13, UPC-A) follow strict GS1 numbering rules — this tool checks that your
            input is the right length and structure, but a number officially assigned through GS1 South Africa is
            still required before it can scan at real retail tills.
          </p>

          <p className="mt-6 text-sm text-navy/60 dark:text-white/50">
            Looking for other quick tools? See all{" "}
            <Link href="/calculators" className="font-semibold text-gold hover:underline">
              free business calculators
            </Link>
            .
          </p>
        </div>
      </div>

      <ProductsTeaser />
    </div>
  );
}
