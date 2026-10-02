import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import FundingReadinessCalculator from "@/components/FundingReadinessCalculator";
import ProductsTeaser from "@/components/ProductsTeaser";
import { breadcrumbSchema, faqSchema, webApplicationSchema } from "@/lib/schema";

const PAGE_URL = `${siteConfig.url}/calculators/funding-readiness-assessment`;

export const metadata: Metadata = {
 title: "Free South African Business Funding Readiness Calculator",
 description: "Check how prepared your South African business is to approach a funder. Get a readiness score, identify document, compliance, financial and commercial gaps, and see what to fix first.",
 alternates:{canonical:PAGE_URL},
 openGraph:{title:"South African Business Funding Readiness Calculator",description:"Check your business funding preparation and get a practical action plan before you apply.",url:PAGE_URL,type:"website"},
 twitter:{card:"summary_large_image"}
};

const FAQS=[
 {question:"Does a high score mean my funding will be approved?",answer:"No. The score measures preparation, not approval probability. Each funder applies its own eligibility criteria, due diligence, affordability tests and programme rules."},
 {question:"Is this assessment only for government funding?",answer:"No. It focuses on evidence that is useful across many formal funding applications, while recognising that government programmes, development finance institutions, banks and private funders can have different requirements."},
 {question:"What documents do South African business funders commonly request?",answer:"Requirements vary, but formal programmes commonly ask for business and ownership records, tax and banking evidence, financial information or projections, a clear breakdown of the funding requirement and supporting quotations or contracts where relevant."},
 {question:"What if a question does not apply to my business?",answer:"Where the assessment offers a Not Applicable option, that check is removed from the scoring denominator so it does not unfairly reduce your score."},
 {question:"Is my information stored?",answer:"No. This assessment runs in your browser and does not ask for your name, ID number, bank details or funding documents."}
];

export default function FundingReadinessPage(){
 const crumbs=breadcrumbSchema([{name:"Home",url:siteConfig.url},{name:"Calculators",url:`${siteConfig.url}/calculators`},{name:"Funding Readiness Calculator",url:PAGE_URL}]);
 return <div>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(webApplicationSchema({name:"South African Business Funding Readiness Calculator",url:PAGE_URL,description:"A free preparation assessment for South African small businesses considering funding.",applicationCategory:"BusinessApplication",featureList:["Weighted funding readiness score","Compliance and document gap check","Financial readiness check","Prioritised action plan","No signup required"]}))}} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(crumbs)}} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema(FAQS))}} />
  <PageHero title="Are you actually ready to apply for business funding?" subtitle="Answer a practical set of questions about your business, finances, documents and funding case. Get a readiness score and a prioritised list of what to fix before you approach a funder." breadcrumbs={[{label:"Home",href:"/"},{label:"Calculators",href:"/calculators"},{label:"Funding Readiness"}]} />
  <main className="container-page py-10">
   <div className="mx-auto max-w-3xl">
    <div className="mb-6 border-l-4 border-gold bg-gold/5 p-5"><p className="font-semibold text-navy dark:text-white">This is not an eligibility or approval checker.</p><p className="mt-1 text-sm leading-relaxed text-navy/65 dark:text-white/65">It measures how well prepared your funding case is. Always confirm the current criteria and document checklist with the specific funder or programme before applying.</p></div>
    <FundingReadinessCalculator />
    <section className="mt-10 border-t border-navy/10 pt-8 dark:border-white/10"><h2 className="text-xl font-bold text-navy dark:text-white">What funders are trying to understand</h2><p className="mt-3 leading-relaxed text-navy/70 dark:text-white/70">Across formal South African funding programmes, the paperwork changes but the underlying questions are familiar: Is the business legitimate and compliant? Is there a viable market? Are the numbers credible? Is the amount requested supported by evidence? Can the business deliver the plan and, for debt funding, service the finance?</p><p className="mt-3 text-sm leading-relaxed text-navy/65 dark:text-white/65">That is why this assessment scores preparation rather than pretending that one checklist can determine approval across every programme.</p></section>
    <section className="mt-8 border border-navy/10 p-6 dark:border-white/10"><h2 className="text-lg font-bold text-navy dark:text-white">Applying for a specific programme?</h2><p className="mt-2 text-sm leading-relaxed text-navy/65 dark:text-white/65">Use this score to find gaps first, then check the funder's current official application page. Programme rules, funding windows, limits and required documents can change.</p><div className="mt-4 flex flex-wrap gap-3"><a href="https://www.dsbd.gov.za/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold hover:underline">Department of Small Business Development →</a><a href="https://systems.sefa.org.za/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold hover:underline">Small-business finance application information →</a></div></section>
    <section className="mt-10"><h2 className="text-xl font-bold text-navy dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-4">{FAQS.map(f=><details key={f.question} className="border border-navy/10 p-4 dark:border-white/10"><summary className="cursor-pointer font-semibold text-navy dark:text-white">{f.question}</summary><p className="mt-3 text-sm leading-relaxed text-navy/70 dark:text-white/70">{f.answer}</p></details>)}</div></section>
    <div className="mt-8 text-sm text-navy/60 dark:text-white/60">If your funding need is tied to a confirmed customer order, also read our <Link className="font-semibold text-gold hover:underline" href="/insights/what-is-purchase-order-funding">purchase order funding guide</Link>.</div>
   </div>
  </main>
  <ProductsTeaser />
 </div>;
}
