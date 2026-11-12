import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = siteConfig.url + "/guides/south-africa-tender-preference-points";

export const metadata: Metadata = {
  title: "South African Tender Preference Points: 80/20 vs 90/10",
  description: "Understand South Africa’s 80/20 and 90/10 tender preference-point systems, price formulas, specific goals, the R50 million threshold and tie-break rules.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "South African Tender Preference Points: 80/20 vs 90/10",
    description: "A plain-language guide to price points, specific goals and tender scoring under the 2022 regulations.",
    url: PAGE_URL,
    type: "article"
  },
  twitter: { card: "summary_large_image" }
};

export default function TenderPreferenceGuidePage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Guides", url: siteConfig.url + "/guides" },
    { name: "Tender Preference Points", url: PAGE_URL }
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <PageHero
        title="South African Tender Preference Points: 80/20 vs 90/10"
        subtitle="Understand how price and specific goals combine, what the R50 million threshold means, and how ties are resolved."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Tender Preference Points" }]}
      />
      <main className="container-page py-10">
        <article className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
          <p>South African public tenders may award points for price and for specific goals named in the tender documents. The 80/20 system gives up to 80 points to price and 20 to specific goals. The 90/10 system gives up to 90 points to price and 10 to specific goals.</p>

          <h2>When does 80/20 or 90/10 apply?</h2>
          <p>The Preferential Procurement Regulations, 2022 use 80/20 for a tender with a rand value at or below R50 million and 90/10 above R50 million. The tender documents must identify the applicable preference system. If the tender says either system may apply because the value is uncertain, the regulations use the lowest acceptable tender to choose the system for goods and services, or the highest acceptable tender for an income-generating contract.</p>

          <h2>How price points are calculated</h2>
          <p>For goods and services, the lowest acceptable tender gets the full price component. Other tenders score fewer points based on how far their price is above that reference. For income-generating contracts such as a lease or disposal, the highest acceptable offer gets the full price component, and lower offers score fewer points.</p>
          <p>For 80/20, one specific-goal point is equivalent to 1.25% of the price component. For 90/10, it is about 1.11%. This describes the formula’s trade-off; it does not mean you can change the goals or points stated in a tender.</p>

          <h2>Specific goals come from the tender documents</h2>
          <p>The organ of state must state the specific goals, points for each goal and the proof required. Read the applicable bidding form and tender conditions carefully. Do not assume that an old B-BBEE status-level table automatically applies under the 2022 regulations; goals and evidence are tender-specific.</p>

          <h2>No R30,000 minimum under the 2022 regulations</h2>
          <p>National Treasury’s implementation guide says the old R30,000 minimum was omitted from the 2022 regulations. The 2022 regulations took effect on 16 January 2023, and the previous regulations remain relevant to tenders advertised before that date under the transition clause. Check the advertisement date and the evaluation rules in your tender pack.</p>

          <h2>How are equal scores handled?</h2>
          <p>If total points tie, the tenderer with more specific-goal points ranks first. If the bids are equal in all respects, the regulations provide for the award to be decided by drawing lots.</p>

          <h2>A score is only one part of the evaluation</h2>
          <p>A bid can be excluded for missing mandatory documents or failing functionality, local-content or other conditions before price and preference points are assessed. This guide and the calculator do not determine whether a tender is compliant or guarantee an award. Use the original tender document as the authority for each submission.</p>

          <div className="not-prose my-8 border-l-4 border-gold bg-gold/5 p-5">
            <h2 className="text-lg font-bold text-navy dark:text-white">Try your figures</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/70 dark:text-white/70">Compare your price and specific-goal points with acceptable bids using the free in-browser calculator.</p>
            <Link href="/calculators/tender-preference-points" className="mt-4 inline-flex min-h-11 items-center bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90">Open the Tender Preference Points Calculator →</Link>
          </div>

          <h2>Official sources</h2>
          <ul>
            <li><Link href="https://www.treasury.gov.za/legislation/regulations/PREFERENTIAL%20PROCUREMENT%20REGULATIONS%2C%202022.pdf" target="_blank">Preferential Procurement Regulations, 2022 — National Treasury</Link></li>
            <li><Link href="https://ocpo.treasury.gov.za/Legislation/guidelines/IMPLEMENTATION%20GUIDE%20PPR%202022%20-%20MARCH%202023%20VERSION%201.pdf" target="_blank">Implementation Guide: Preferential Procurement Regulations, 2022 — National Treasury</Link></li>
            <li><Link href="https://collections.concourt.org.za/server/api/core/bitstreams/2589925f-73c1-4383-887e-f9334e3cdca8/content" target="_blank">Public Procurement Act judgment — Constitutional Court, 17 September 2026</Link></li>
          </ul>
          <p><small>Sources checked on 12 November 2026. Confirm current requirements against each tender document.</small></p>
        </article>
      </main>
    </div>
  );
}
