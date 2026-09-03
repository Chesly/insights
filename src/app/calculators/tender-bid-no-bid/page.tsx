import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import TenderCalculator from "@/components/TenderCalculator";
import ProductsTeaser from "@/components/ProductsTeaser";
import FaqAnswer from "@/components/FaqAnswer";
import { breadcrumbSchema, faqSchema, howToSchema, webApplicationSchema } from "@/lib/schema";

const PAGE_URL = `${siteConfig.url}/calculators/tender-bid-no-bid`;

export const metadata: Metadata = {
  title: "Bid or No-Bid? Free South African Tender Decision Calculator",
  description:
    "Score any South African tender out of 100 before you bid. Free bid/no-bid calculator with CSD, B-BBEE and CIDB checks, a full profitability model in rand, and a printable decision record. No signup.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bid or No-Bid? Free South African Tender Decision Calculator",
    description:
      "Score any SA tender out of 100 before you commit two weeks to it. Twelve weighted criteria, a full rand costing model, and a printable decision record.",
    url: PAGE_URL,
    type: "website"
  },
  twitter: { card: "summary_large_image" }
};

const HOW_TO_STEPS = [
  { name: "Check the mandatory requirements", text: "Read the tender document and confirm you meet every mandatory requirement, including an active CSD profile, a valid SARS Tax Compliance Status PIN and a current B-BBEE certificate or sworn affidavit." },
  { name: "Score the opportunity", text: "Rate twelve weighted criteria covering experience, turnover, certifications, resources, location, delivery capability, margin, cash flow and preparation time." },
  { name: "Cost the work honestly", text: "Build up direct costs and overheads, add contingency, and calculate the gross margin the tender price actually leaves you." },
  { name: "Check the cash-flow exposure", text: "Work out how much money you must carry between starting work and the client paying, typically thirty days after invoice." },
  { name: "Record the decision", text: "Accept or override the recommendation, write down the reason, and keep the printed record for your next bid review." }
];

const FAQS = [
  { question: "What is a bid/no-bid decision?", answer: "A bid/no-bid decision is a structured assessment of whether a tender is worth pursuing, made before you commit staff time to writing the submission. It weighs compliance, capability, commercial return and cash flow against each other so that the choice to walk away is a deliberate strategic decision rather than an accident." },
  { question: "Do I need CSD registration to bid on a South African government tender?", answer: "Yes. Every bidder must be registered on the National Treasury Central Supplier Database at csd.gov.za before submitting a bid to an organ of state. Registration itself is free and generally takes between one and three weeks, with most delays caused by name mismatches between CIPC records, the banking confirmation letter and director IDs." },
  { question: "How long is a B-BBEE certificate valid for a tender?", answer: "Twelve months. An expired B-BBEE certificate or sworn affidavit is one of the most common reasons a bid is disqualified, because many bidders reuse the version from their previous submission without checking the date." },
  { question: "Do I still need a tax clearance certificate for tenders?", answer: "No. The tax clearance certificate was retired in 2016 and replaced by the SARS Tax Compliance Status PIN, requested through eFiling, which allows the buyer to verify your status online at the time of evaluation." },
  { question: "What profit margin should a South African SME target on a tender?", answer: "There is no single correct figure, but a margin that survives only if nothing goes wrong is not a margin. Set a written minimum before you price, hold a contingency of at least five per cent of cost, and treat any margin close to that floor as a no-bid rather than a stretch." },
  { question: "Is this calculator legal or financial advice?", answer: "No. It is a planning and organisation tool. It does not verify your compliance status and does not replace the tender document, your accountant or your attorney. Confirm every requirement against the tender document itself before submitting." },
  { question: "Can I override the recommendation?", answer: "Yes, and sometimes you should — a first reference in a sector you want long-term can justify a thin margin. The calculator only asks you to write the reason down. Six months later, that one line is the difference between a strategic decision you can learn from and a mistake you will repeat." },
  { question: "Is my data stored anywhere?", answer: "By default, no — nothing leaves your device. The calculator does remember your progress, your company name and who decides in your browser's own local storage, so you can close the tab and pick up where you left off — that never leaves your browser and you can clear it any time. If you choose to use the optional \"Email me these results\" button at the end, we store your name, email and the results you generated on our server so we can send them to you, and — only if you tick the box — send you occasional tips and new tools. That's the only case anything leaves your browser." }
];

const CRITERIA_NOTES = [
  { label: "Mandatory requirements", weight: "15 · disqualifier", note: "Public tenders are evaluated in stages, and the first stage is administrative compliance. If a mandatory return is missing, your envelope is set aside before anyone reads your price. This carries the heaviest weight and acts as a hard gate for exactly that reason." },
  { label: "Certifications and registrations", weight: "10 · disqualifier", note: "An active CSD profile, a current SARS Tax Compliance Status PIN, a valid B-BBEE certificate or sworn affidavit, and any sector licence — CIDB grading for construction, PSIRA for security, a COIDA Letter of Good Standing for almost anything involving staff on site. These are pass/fail, not points." },
  { label: "Experience and references", weight: "10", note: "Functionality scoring usually asks for comparable contracts of similar value, with contactable references on a letterhead. “We can do it” scores nothing. A signed reference letter for a similar-sized job scores." },
  { label: "Ability to deliver", weight: "10", note: "Winning work you cannot deliver is worse than losing it. Penalties, a damaged reference and possible restriction from future bidding cost more than the contract was worth." },
  { label: "Profit margin", weight: "10", note: "Scored separately from contract value, because a large contract at 4% is a worse business than a small one at 25%. Use the costing section above before you answer this one." },
  { label: "Cash flow", weight: "9", note: "The quiet killer of South African SMEs on public work. You buy materials and pay wages in week one; the invoice goes out at month end; payment terms are thirty days and are not always met. Municipal and SOE work is slower than national departments." },
  { label: "Turnover and financial standing", weight: "8", note: "Many tenders set a minimum annual turnover or require audited financials. Some are explicit; some hide it in the returnable schedules. Check before you price, not after." },
  { label: "Resources", weight: "8", note: "People, plant and vehicles that are genuinely free for that period — not the same team you have already promised to another site." },
  { label: "Contract value fit", weight: "7", note: "A contract that is too large strains cash flow and delivery; one that is too small does not repay the bid cost. Both are reasons to decline." },
  { label: "Location", weight: "6", note: "Travel, accommodation and supervision across provinces are real costs that quietly eat margin. A Gauteng contractor servicing a Limpopo site needs those numbers in the costing, not in their head." },
  { label: "Time to closing", weight: "5", note: "If a compulsory briefing has passed, the decision is already made for you. If two weeks remain and three documents are outstanding, be honest about whether the submission will be complete or merely submitted." },
  { label: "Strategic value", weight: "2", note: "Deliberately the smallest weight. Strategic value is the most common excuse for bidding on work that makes no commercial sense. It should tip a borderline decision, never rescue a bad one." }
];

const DISQUALIFIERS = [
  "An expired B-BBEE certificate or affidavit. Valid for twelve months. The single most common disqualifier, because bidders reuse the copy from their last submission without checking the date.",
  "No CSD registration, or a CSD profile with details that do not match. The buyer pulls your profile from the database. If the CIPC name, banking letter and ID copies disagree, that is a finding against you.",
  "A missing or lapsed SARS Tax Compliance Status PIN. The old tax clearance certificate was withdrawn in 2016. Buyers verify your status live.",
  "Uncertified or stale ID copies. Certification is generally required within the last three months, for every listed director.",
  "Unsigned SBD forms or declarations. An unsigned declaration is treated as an incomplete return.",
  "A pricing schedule altered, left incomplete, or priced in the wrong format. Use their schedule, in their format, filled in completely.",
  "Missing the compulsory briefing or site inspection. No attendance certificate, no bid. This one cannot be fixed afterwards.",
  "No COIDA Letter of Good Standing where staff will be on the buyer's premises.",
  "Late submission. A tender closing at 11:00 means the box is sealed at 11:00.",
  "Documents attached in the wrong envelope or the wrong file on the electronic portal."
];

const COMPLIANCE_DOCS = [
  ["CSD registration", "National Treasury, csd.gov.za", "Ongoing — update within 30 days of any change"],
  ["Tax Compliance Status PIN", "SARS eFiling", "Verified live by the buyer; keep standing current"],
  ["B-BBEE certificate or sworn affidavit", "SANAS-accredited agency, or commissioner of oaths for an EME/QSE affidavit", "12 months"],
  ["CIPC company documents", "CIPC", "Ongoing — annual returns must be up to date"],
  ["Banking confirmation letter", "Your bank, business account in the registered name", "Commonly required within 3 months"],
  ["Certified ID copies, all directors", "Commissioner of oaths", "Commonly required within 3 months"],
  ["COIDA Letter of Good Standing", "Compensation Fund", "12 months"],
  ["Public liability insurance", "Your insurer", "Annual"],
  ["CIDB grading (construction)", "CIDB", "Renewable, grade must match contract value"],
  ["PSIRA registration (security)", "PSIRA", "Annual"],
  ["Financial statements", "Your accountant", "Usually the last 1–3 financial years"],
  ["Reference letters", "Past clients, on letterhead", "No expiry, but recency counts in scoring"]
];

export default function TenderBidNoBidCalculatorPage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Calculators", url: `${siteConfig.url}/calculators` },
    { name: "Bid/No-Bid Calculator", url: PAGE_URL }
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webApplicationSchema({
              name: "TenderOS SA Bid / No-Bid Calculator",
              url: PAGE_URL,
              description: "Score any South African tender out of 100 before you bid, with a full profitability model in rand and a printable decision record.",
              applicationCategory: "BusinessApplication",
              featureList: [
                "Weighted 12-criterion bid/no-bid score",
                "Tender profitability and margin calculator in rand",
                "Compliance disqualifier flagging",
                "Printable decision record"
              ]
            })
          )
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema("How to decide whether to bid on a South African tender", HOW_TO_STEPS)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      <PageHero
        title="Know which tenders are worth bidding for."
        subtitle="Answer twelve questions about the tender in front of you. Get a score, a recommendation, and a printable record of why you decided what you decided — before you spend two weeks on a bid you were never going to win."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Bid/No-Bid Calculator" }]}
      />

      <div className="container-page py-4">
        <div className="mx-auto max-w-3xl">
          <TenderCalculator />

          {/* Upsell */}
          <section className="mt-4 border border-gold/20 bg-gold/5 p-6">
            <h3 className="text-base font-bold text-navy dark:text-white">This is one tender. The South African Tender Toolkit handles every tender you assess.</h3>
            <p className="mt-2 text-sm text-navy/70 dark:text-white/70">
              A full spreadsheet workspace — a tender register that tracks your win rate, this bid scorer and pricing
              model built as reusable formulas, a compliance register that flags expiring documents before they cost
              you a bid, a submission checklist, and a printable decision record.
            </p>
            <a
              href="/tools/south-african-tender-toolkit"
              className="mt-4 inline-block border border-gold bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark"
            >
              Get the Tender Toolkit
            </a>
          </section>

          {/* Why SMEs over-bid */}
          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">Why most South African SMEs bid far too often</h2>
            <p className="mt-3 text-base leading-relaxed text-navy dark:text-white">
              A tender submission costs a small business somewhere between forty and a hundred and twenty hours once
              you count the site meeting, the pricing schedule, chasing certified copies, and the two evenings spent
              formatting a technical proposal.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              Price that at even R350 an hour of owner and admin time and a single bid costs you R14,000 to R42,000
              before you print a page. Most SMEs never account for it, because it does not appear on a bank
              statement. It appears as the month you had no time to invoice.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <div className="font-mono text-2xl font-extrabold text-navy dark:text-white">5 at 40%</div>
                <p className="mt-1 text-sm text-navy/60 dark:text-white/50">Five carefully chosen bids at a 40% win rate returns two contracts.</p>
              </div>
              <div>
                <div className="font-mono text-2xl font-extrabold text-navy dark:text-white">20 at 10%</div>
                <p className="mt-1 text-sm text-navy/60 dark:text-white/50">Twenty scattered bids at a 10% win rate returns the same two contracts, for four times the work.</p>
              </div>
              <div>
                <div className="font-mono text-2xl font-extrabold text-navy dark:text-white">18 no-bids</div>
                <p className="mt-1 text-sm text-navy/60 dark:text-white/50">The difference between those two businesses is not luck. It is eighteen decisions to walk away.</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              The discipline is not in writing better bids. It is in writing fewer of them, and putting the recovered
              time into the ones you can actually win. That is the entire purpose of a bid/no-bid decision.
            </p>
            <h3 className="mt-6 text-base font-bold text-navy dark:text-white">Why &ldquo;unsure&rdquo; is the most dangerous answer</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              In the calculator above, an unsure answer scores half marks — not because half is fair, but because
              unsure is not neutral. Every unsure is an unfinished task with a deadline attached. If four criteria
              are unsure a week before closing, you do not have a 70% opportunity. You have a 70% opportunity and
              four unpaid days of work standing between you and finding out.
            </p>
          </section>

          {/* 12 criteria explained */}
          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">The twelve criteria, explained for South African tenders</h2>
            <p className="mt-2 text-sm text-navy/60 dark:text-white/50">Why each one carries the weight it does.</p>
            <div className="mt-5 space-y-5">
              {CRITERIA_NOTES.map((c) => (
                <div key={c.label} className="border-l-2 border-navy/10 pl-4 dark:border-white/10">
                  <p className="font-bold text-navy dark:text-white">
                    {c.label} <span className="ml-1 text-xs font-semibold text-gold">weight {c.weight}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-navy/70 dark:text-white/60">{c.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disqualifiers */}
          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">What gets South African bids thrown out before pricing is opened</h2>
            <ul className="mt-4 space-y-3">
              {DISQUALIFIERS.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-navy/75 dark:text-white/70">
                  <span className="text-gold">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-navy/60 dark:text-white/50">
              Nine of these ten are administrative. None of them are about whether you could have done the work well.
              That is what makes them worth a checklist.
            </p>
          </section>

          {/* Compliance docs table */}
          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">Compliance documents and how long they last</h2>
            <p className="mt-2 text-sm text-navy/60 dark:text-white/50">The documents most often requested. Always confirm against the tender document itself.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gold/20 bg-gold/5">
                    <th className="p-3 text-left font-semibold text-navy dark:text-white">Document</th>
                    <th className="p-3 text-left font-semibold text-navy dark:text-white">Where it comes from</th>
                    <th className="p-3 text-left font-semibold text-navy dark:text-white">Typical validity</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPLIANCE_DOCS.map((row) => (
                    <tr key={row[0]} className="border-t border-navy/10 dark:border-white/10">
                      <td className="p-3 font-medium text-navy dark:text-white">{row[0]}</td>
                      <td className="p-3 text-navy/70 dark:text-white/60">{row[1]}</td>
                      <td className="p-3 text-navy/70 dark:text-white/60">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-navy/50 dark:text-white/40">
              An EME with turnover below R10 million can generally use a sworn affidavit rather than paying for a
              verification certificate. Note also that the Public Procurement Act 28 of 2024 has been signed and
              draft regulations were published in April 2026 — the day-to-day picture has not shifted yet, but check
              the tender document rather than assuming last year&rsquo;s rules.
            </p>
          </section>

          {/* Worked example */}
          <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10">
            <h2 className="text-xl font-bold text-navy dark:text-white">A worked example</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              A Gauteng cleaning company is looking at a twelve-month contract for a municipal building, advertised
              around R2,000,000.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-navy/75 dark:text-white/70">
              <li>Labour for eight cleaners and a supervisor: R1,180,000</li>
              <li>Consumables and chemicals: R210,000</li>
              <li>Equipment and machine servicing: R95,000</li>
              <li>Transport and supervision visits: R88,000</li>
              <li>Administration, insurance and finance costs: R160,000</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              That is R1,733,000 before contingency. Add 5% and the total cost is R1,819,650, leaving a gross profit
              of R180,350 — a margin of 9.0%. Against a written minimum of 15%, this is a no-bid on price alone; the
              company would need roughly R2,140,000 to reach a 15% margin.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              The cash-flow line matters just as much. At roughly R151,600 of cost per month and thirty-day payment
              terms, the company must fund about R151,600 of wages and consumables before the first invoice is paid —
              and municipal payment is frequently slower than thirty days. On a 9% margin, one late payment cycle
              consumes most of the year&rsquo;s profit.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 dark:text-white/70">
              The useful outcome here is not &ldquo;we lost&rdquo;. It is a documented reason to decline, and a
              number — R2,140,000 — to test against the market before the next similar tender appears.
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
            This is a planning and organisation tool. It does not verify your compliance status and it is not legal,
            tax or financial advice. Confirm every requirement against the tender document itself and with your own
            advisors before submitting.
          </p>
        </div>
      </div>

      <ProductsTeaser />
    </div>
  );
}
