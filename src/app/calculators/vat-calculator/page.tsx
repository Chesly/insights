import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import VatCalculator from "@/components/VatCalculator";
import ProductsTeaser from "@/components/ProductsTeaser";
import FaqAnswer from "@/components/FaqAnswer";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/schema";

const PAGE_URL = `${siteConfig.url}/calculators/vat-calculator`;

export const metadata: Metadata = {
  title: "South African VAT Calculator — Add or Remove 15% VAT",
  description:
    "Free South African VAT calculator. Add or remove 15% VAT from any amount instantly, with the working shown. No signup, nothing uploaded — runs entirely in your browser.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "South African VAT Calculator — Add or Remove 15% VAT",
    description: "Add or remove 15% VAT from any amount instantly, with the working shown.",
    url: PAGE_URL,
    type: "website"
  },
  twitter: { card: "summary_large_image" }
};

const FAQS = [
  {
    question: "What is the current VAT rate in South Africa?",
    answer:
      "15%. A proposed increase to 15.5% and then 16% during 2025 and 2026 was withdrawn after legal challenges, and the standard rate has remained at 15% since April 2018."
  },
  {
    question: "How do I add VAT to a price?",
    answer: "Multiply the VAT-exclusive amount by 0.15 to get the VAT amount, then add it to the original amount. R1,000 excl. VAT becomes R1,000 + R150 = R1,150 incl. VAT."
  },
  {
    question: "How do I remove VAT from a price to find the VAT-exclusive amount?",
    answer:
      "Divide the VAT-inclusive amount by 1.15, not by 0.85 — a common mistake. R1,150 incl. VAT divided by 1.15 gives R1,000 excl. VAT, and the difference (R150) is the VAT portion."
  },
  {
    question: "Do I have to charge VAT on my invoices?",
    answer:
      "Only if you are a VAT vendor registered with SARS. Registration is compulsory once your taxable turnover exceeds R1 million in any consecutive twelve-month period, and voluntary from R50,000. An unregistered business must not charge VAT or issue a VAT invoice."
  },
  {
    question: "What must a valid South African VAT invoice show?",
    answer:
      "The words \"Tax Invoice\", the seller's name, address and VAT registration number, the invoice date and a unique number, a description of the goods or services, the amount, the VAT charged (or a statement that VAT is included at the rate charged), and — for invoices over R5,000 — the buyer's details too."
  },
  {
    question: "Is this calculator legal or tax advice?",
    answer:
      "No. It is a quick working tool for a standard 15% calculation. Zero-rated and exempt supplies, imports, and VAT on specific industries follow different rules — confirm anything that affects a real return with SARS or your accountant."
  }
];

export default function VatCalculatorPage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Calculators", url: `${siteConfig.url}/calculators` },
    { name: "VAT Calculator", url: PAGE_URL }
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webApplicationSchema({
              name: "South African VAT Calculator",
              url: PAGE_URL,
              description: "Add or remove 15% VAT from any amount instantly, with the working shown.",
              applicationCategory: "BusinessApplication",
              featureList: [
                "Add VAT to a VAT-exclusive amount",
                "Remove VAT from a VAT-inclusive amount",
                "Adjustable VAT rate",
                "Instant, in-browser calculation"
              ]
            })
          )
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      <PageHero
        title="South African VAT Calculator"
        subtitle="Add or remove 15% VAT from any amount in seconds, with the working shown so you can check it."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "VAT Calculator" }]}
      />

      <div className="container-page py-4">
        <div className="mx-auto max-w-2xl">
          <section className="border-b border-navy/10 py-8 dark:border-white/10">
            <VatCalculator />
          </section>

          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">The two calculations, explained</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              South Africa&rsquo;s standard VAT rate is 15%. Getting from one figure to the other only ever needs one
              of two calculations, and the second one is where most people go wrong.
            </p>
            <div className="mt-5 space-y-4">
              <div className="border-l-2 border-navy/10 pl-4 dark:border-white/10">
                <p className="font-bold text-navy dark:text-white">Adding VAT (you have the price excl. VAT)</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/70 dark:text-white/60">
                  Multiply by 1.15. R1,000 × 1.15 = R1,150. The VAT portion is R150.
                </p>
              </div>
              <div className="border-l-2 border-navy/10 pl-4 dark:border-white/10">
                <p className="font-bold text-navy dark:text-white">Removing VAT (you have the price incl. VAT)</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/70 dark:text-white/60">
                  Divide by 1.15 — <em>not</em> by 0.85, and don&rsquo;t just subtract 15%. R1,150 ÷ 1.15 = R1,000. The
                  VAT portion is still R150, but 15% of R1,150 (R172.50) is the wrong number — that formula only works
                  starting from the exclusive amount, which is exactly what you don&rsquo;t have yet.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">Do you need to charge VAT at all?</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              Only if you&rsquo;re registered with SARS as a VAT vendor. Registration becomes compulsory once your
              taxable turnover exceeds R1 million in any rolling twelve-month period, and you can register
              voluntarily from R50,000. Charging VAT, or issuing a document that looks like a tax invoice, without
              being registered is not allowed — and it&rsquo;s a common mistake for a growing business that crosses
              the threshold mid-year without noticing.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              A valid tax invoice needs the words &ldquo;Tax Invoice&rdquo;, your name, address and VAT number, the
              date and a unique invoice number, a description of what was supplied, the amount, and the VAT charged
              — plus the buyer&rsquo;s details for anything over R5,000.
            </p>
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
            This is a general working tool for the standard 15% rate. Zero-rated and exempt supplies, imports and
            industry-specific rules are not covered — confirm anything that affects a real VAT return with SARS or
            your accountant.
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
