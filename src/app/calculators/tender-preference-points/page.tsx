import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import TenderPreferenceCalculator from "@/components/TenderPreferenceCalculator";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/schema";

const PAGE_URL = siteConfig.url + "/calculators/tender-preference-points";

export const metadata: Metadata = {
  title: "Tender Preference Points Calculator South Africa | 80/20 & 90/10",
  description: "Calculate South African tender price and specific-goal points under the 2022 Preferential Procurement Regulations. Compare acceptable bids and see the 80/20 or 90/10 result.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "South African Tender Preference Points Calculator",
    description: "Compare price and specific-goal points under South Africa’s 80/20 and 90/10 tender systems.",
    url: PAGE_URL,
    type: "website"
  },
  twitter: { card: "summary_large_image" }
};

const FAQS = [
  {
    question: "How does the 80/20 or 90/10 system get selected?",
    answer: "The tender documents must state the applicable preference-point system. If they say either 80/20 or 90/10 because it is unclear, the 2022 regulations use the lowest acceptable tender for goods and services or the highest acceptable tender for income-generating contracts to determine the system."
  },
  {
    question: "Does the 2022 system have a R30,000 minimum?",
    answer: "No. National Treasury’s 2022 implementation guide says the former R30,000 minimum threshold was omitted. This calculator does not exclude tenders below R30,000. Check older tenders against the rules that applied when they were advertised."
  },
  {
    question: "Are B-BBEE status levels automatically used to award preference points?",
    answer: "No. The 2022 regulations require the tender documents to identify the specific goals, points and proof for that tender. The old B-BBEE level table is shown here only as a historic reference; do not use it unless the current tender expressly sets out that scoring."
  },
  {
    question: "What happens when two bids get the same score?",
    answer: "If total points tie, the bid with more specific-goal points ranks higher. If they are equal in all respects, the 2022 regulations say the award is decided by drawing lots."
  },
  {
    question: "Does a high score mean my bid will win?",
    answer: "No. This tool models price and specific-goal points only. Mandatory compliance, functionality, local content, tender-specific rules, exemptions and other evaluation stages can affect whether a bid is considered and who receives the award."
  },
  {
    question: "Are my bid figures saved?",
    answer: "No. The calculator runs in your browser and does not save or send the figures you enter."
  }
];

export default function TenderPreferencePointsPage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Calculators", url: siteConfig.url + "/calculators" },
    { name: "Tender Preference Points Calculator", url: PAGE_URL }
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema({
        name: "South African Tender Preference Points Calculator",
        url: PAGE_URL,
        description: "Calculate price and specific-goal points under South Africa’s 80/20 and 90/10 preference-point systems.",
        applicationCategory: "BusinessApplication",
        featureList: [
          "80/20 and 90/10 preference-point scoring",
          "Goods and services tender calculations",
          "Income-generating tender calculations",
          "Rank your bid against up to nine competitors",
          "Show price and specific-goal points separately",
          "Runs in the browser without storing bid figures"
        ]
      })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      <PageHero
        title="Tender Preference Points Calculator"
        subtitle="Compare tender price and specific-goal points under South Africa’s 80/20 and 90/10 systems."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Tender Preference Points" }]}
      />

      <main className="container-page py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 border-l-4 border-gold bg-gold/5 p-5">
            <p className="font-semibold text-navy dark:text-white">Use the preference system and scoring goals stated in the tender documents.</p>
            <p className="mt-1 text-sm leading-relaxed text-navy/70 dark:text-white/70">This calculator is a planning aid for price and specific-goal points. It does not decide compliance or replace the tender’s conditions.</p>
          </div>

          <TenderPreferenceCalculator />

          <article className="prose prose-lg mt-12 max-w-none dark:prose-invert">
            <h2>How the 80/20 and 90/10 tender systems work</h2>
            <p>South Africa’s Preferential Procurement Regulations, 2022 award price points and specific-goal points. The 80/20 system allocates up to 80 points to price and 20 to the tender’s specified goals. The 90/10 system allocates up to 90 points to price and 10 to those goals.</p>
            <p>For goods and services, the price formula compares a tender with the lowest acceptable tender. For an income-generating contract, such as a lease or disposal, it compares bids with the highest acceptable tender. The applicable system and goals must be set out in the tender documents. If the invitation says either system may apply, the regulations use the lowest acceptable tender for goods and services, or the highest acceptable tender for income-generating contracts, to select between them.</p>

            <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
              <div className="border border-navy/10 p-5 dark:border-white/10">
                <h3 className="font-bold text-navy dark:text-white">80/20</h3>
                <p className="mt-2 text-sm text-navy/70 dark:text-white/70">For tenders with a rand value at or below R50 million, where the tender documents specify this system. One goal point is equivalent to 1.25% of the price component.</p>
              </div>
              <div className="border border-navy/10 p-5 dark:border-white/10">
                <h3 className="font-bold text-navy dark:text-white">90/10</h3>
                <p className="mt-2 text-sm text-navy/70 dark:text-white/70">For tenders with a rand value above R50 million, where the tender documents specify this system. One goal point is equivalent to 1.11% of the price component (rounded to two decimals).</p>
              </div>
            </div>

            <h2>There is no R30,000 minimum in the 2022 regulations</h2>
            <p>National Treasury’s implementation guide explains that the previous R30,000 minimum was omitted from the 2022 regulations. This calculator therefore does not switch the preference system off for smaller tenders. Tenders advertised before the 2022 regulations took effect on 16 January 2023 may fall under the previous rules, so check the tender date and its stated evaluation method.</p>

            <h2>Specific goals and tie-breaks</h2>
            <p>The tender document sets the specific goals, their point allocation and the proof required. The 2022 regulations do not provide a universal B-BBEE status-level point table. The historical table above is not a default scoring method. If total points tie, the bid with more specific-goal points ranks higher; if the bids are equal in all respects, the regulations say the award is decided by drawing lots.</p>

            <h2>What this calculator does not score</h2>
            <p>It does not assess mandatory returns, functionality thresholds, local production requirements, price reasonableness, exclusions, exemptions or other tender conditions. A bid can fail before price and specific-goal scoring. Use only bids that are acceptable under the tender rules when entering competitors.</p>
          </article>

          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">Official sources</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-navy/70 dark:text-white/70">
              <li><Link className="font-semibold text-gold hover:underline" href="https://www.treasury.gov.za/legislation/regulations/PREFERENTIAL%20PROCUREMENT%20REGULATIONS%2C%202022.pdf" target="_blank">National Treasury: Preferential Procurement Regulations, 2022 (Government Gazette 47452) →</Link></li>
              <li><Link className="font-semibold text-gold hover:underline" href="https://ocpo.treasury.gov.za/Legislation/guidelines/IMPLEMENTATION%20GUIDE%20PPR%202022%20-%20MARCH%202023%20VERSION%201.pdf" target="_blank">National Treasury: Implementation Guide, March 2023 (including the R30,000 threshold explanation) →</Link></li>
              <li><Link className="font-semibold text-gold hover:underline" href="https://collections.concourt.org.za/server/api/core/bitstreams/2589925f-73c1-4383-887e-f9334e3cdca8/content" target="_blank">Constitutional Court: Public Procurement Act 28 of 2024 judgment, decided 17 September 2026 →</Link></li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-navy/55 dark:text-white/55">Rules and source documents checked on 12 November 2026. Procurement requirements may change. Follow the current tender documents and verify the applicable rules before submitting a bid.</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy dark:text-white">Frequently asked questions</h2>
            <div className="mt-4 space-y-3">{FAQS.map((item) => <details key={item.question} className="border border-navy/10 p-4 dark:border-white/10"><summary className="cursor-pointer font-semibold text-navy dark:text-white">{item.question}</summary><p className="mt-3 text-sm leading-relaxed text-navy/70 dark:text-white/70">{item.answer}</p></details>)}</div>
          </section>
        </div>
      </main>
    </div>
  );
}
