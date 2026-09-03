import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import RetentionCalculator from "@/components/RetentionCalculator";
import ProductsTeaser from "@/components/ProductsTeaser";
import FaqAnswer from "@/components/FaqAnswer";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/schema";

const PAGE_URL = `${siteConfig.url}/calculators/retention-calculator`;

export const metadata: Metadata = {
  title: "Retention & Progress Payment Calculator for SA Contractors",
  description:
    "Work out retention withheld, net payment due and VAT on any progress claim, and track when your retention gets released. Free, no signup — built for South African construction and government contracts.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Retention & Progress Payment Calculator for SA Contractors",
    description:
      "Work out retention withheld, net payment due and VAT on any progress claim, and track when your retention gets released.",
    url: PAGE_URL,
    type: "website"
  },
  twitter: { card: "summary_large_image" }
};

const FAQS = [
  {
    question: "What is retention on a South African construction contract?",
    answer:
      "Retention is a percentage of each progress payment — commonly 5% to 10% — that the employer withholds as security against defective or incomplete work. It is not a penalty and not lost; it is released once the risk it covers has passed, in two stages under most JBCC and NEC-based contracts."
  },
  {
    question: "When does the employer release retention?",
    answer:
      "In two moieties. The first half is typically released at practical completion, once the works are handed over and in use. The second half is released at the end of the defects liability period — usually twelve months later — once any defects identified during that period have been fixed."
  },
  {
    question: "Is there a limit to how much retention can be withheld?",
    answer:
      "Yes, almost always. Contracts typically cap total retention at a fixed percentage of the contract value, commonly 5%. Once cumulative retention reaches that cap, no further retention should be deducted from later claims — check every certificate against this, since it is a common place for a mistake to go unnoticed."
  },
  {
    question: "Do I charge VAT on the full claim, or only on the amount after retention?",
    answer:
      "VAT is charged on the net amount actually payable — the claim value less the retention withheld — not on the full claim value. The retained portion becomes liable for VAT only when it is actually paid out on release, not at the time it is withheld."
  },
  {
    question: "Why does retention matter for cash flow?",
    answer:
      "Because it is money you have already spent labour and materials earning, that sits with the client for months, sometimes over a year. On a contract with thin margins, the retained amount can be larger than the entire profit — which is exactly why it needs to be planned for, not discovered."
  },
  {
    question: "Is this calculator legal or financial advice?",
    answer: "No. It is a planning tool for a standard retention structure. Confirm the actual retention rate, cap and release conditions against your specific contract, which may differ from the JBCC/NEC norms this calculator assumes."
  }
];

export default function RetentionCalculatorPage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Calculators", url: `${siteConfig.url}/calculators` },
    { name: "Retention & Progress Payment Calculator", url: PAGE_URL }
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webApplicationSchema({
              name: "Retention & Progress Payment Calculator",
              url: PAGE_URL,
              description: "Work out retention withheld, net payment due and VAT on any progress claim, and track when retention gets released.",
              applicationCategory: "BusinessApplication",
              featureList: [
                "Retention withheld per progress claim",
                "Retention cap tracking",
                "VAT on net payment due",
                "Cash-flow exposure per claim",
                "First and final retention release amounts"
              ]
            })
          )
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      <PageHero
        title="Retention & Progress Payment Calculator"
        subtitle="Work out what a progress claim actually pays out after retention and VAT — and track when the money being held gets released."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Retention & Progress Payment Calculator" }]}
      />

      <div className="container-page py-4">
        <div className="mx-auto max-w-3xl">
          <RetentionCalculator />

          {/* Upsell */}
          <section className="mt-4 border border-gold/20 bg-gold/5 p-6">
            <h3 className="text-base font-bold text-navy dark:text-white">Won the tender? The cash-flow gap doesn&rsquo;t end there.</h3>
            <p className="mt-2 text-sm text-navy/70 dark:text-white/70">
              Retention held for months, plus thirty-plus-day payment terms, is exactly what the{" "}
              <Link href="/tools/purchase-order-funding-toolkit-south-african-edition" className="font-semibold text-gold hover:underline">
                Purchase Order Funding Toolkit
              </Link>{" "}
              is built to plan around — bridging the gap between starting work and actually being paid.
            </p>
          </section>

          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">Why retention catches South African SMEs off guard</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              Retention is not a hidden cost — it is written into every standard-form contract — but it is routinely
              left out of a small contractor&rsquo;s cash-flow planning anyway. The work is done, the material is
              bought, the wages are paid, and then five or ten percent of what was earned simply does not arrive with
              the rest of the payment. It arrives later, in two pieces, sometimes over a year apart.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              On government and municipal work this compounds with payment terms that are already thirty days on
              paper and often slower in practice. See{" "}
              <Link href="/insights/why-government-suppliers-need-to-understand-their-invoice-status" className="font-semibold text-gold hover:underline">
                why government suppliers need to understand their invoice status
              </Link>{" "}
              and{" "}
              <Link href="/insights/selling-to-gauteng-government-what-vendors-need-to-know-about-the-new-invoice-system" className="font-semibold text-gold hover:underline">
                what vendors need to know about the new invoice system
              </Link>{" "}
              for what that looks like once you&rsquo;ve won the work.
            </p>
          </section>

          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">A worked example</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              A contractor is three months into a R2,400,000 renovation contract with 5% retention per claim, capped
              at 5% of contract value. This month&rsquo;s certificate values the work done at R480,000 excl. VAT.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-navy/75 dark:text-white/70">
              <li>Retention withheld this claim: R480,000 × 5% = R24,000</li>
              <li>Net before VAT: R480,000 − R24,000 = R456,000</li>
              <li>VAT at 15%: R68,400</li>
              <li>Amount actually paid: R524,400</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              R24,000 that month, and roughly the same on every claim before the cap is reached, sits with the client
              until practical completion — and then only half of it. The rest waits for the defects liability period
              to run out. None of it is lost. All of it needs to be planned for.
            </p>
          </section>

          {/* FAQ */}
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
            This is a planning tool for a standard retention structure. Confirm the actual retention rate, cap and
            release conditions against your specific contract before relying on these numbers.
          </p>

          <p className="mt-6 text-sm text-navy/60 dark:text-white/50">
            Deciding whether to bid in the first place?{" "}
            <Link href="/calculators/tender-bid-no-bid" className="font-semibold text-gold hover:underline">
              Use the bid/no-bid calculator
            </Link>
            , or see all{" "}
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
