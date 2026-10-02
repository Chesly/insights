"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { printReport, shareReport, type PdfReport } from "@/lib/client-report";

type Answer = "yes" | "partial" | "no" | "na";
type Check = { id:string; group:string; title:string; detail:string; weight:number; critical?:boolean; fix:string; allowNA?:boolean };

const CHECKS: Check[] = [
 {id:"registration",group:"Business foundation",title:"Business registration and ownership records are current.",detail:"Formal programmes commonly ask for entity and ownership evidence. Requirements differ for sole proprietors, companies and co-operatives.",weight:8,fix:"Confirm the legal form required by the programme and prepare current registration and ownership records."},
 {id:"bank",group:"Business foundation",title:"You have an active business bank account and recent statements.",detail:"Banking evidence is commonly used for verification, financial assessment and disbursement.",weight:8,critical:true,fix:"Open or regularise the business account and collect the statements or confirmation letter the funder requests."},
 {id:"tax",group:"Compliance",title:"Your SARS registration and tax status are in order.",detail:"Tax compliance is a recurring requirement across formal public funding programmes.",weight:9,critical:true,fix:"Check your SARS position and resolve outstanding returns, registrations or mismatched details."},
 {id:"permits",group:"Compliance",title:"You have the licences, permits and sector registrations that apply to your business.",detail:"The requirement depends on your activity and location. Do not assume every business needs the same licence.",weight:5,fix:"List only the registrations relevant to your sector and municipality and close any gaps.",allowNA:true},
 {id:"labour",group:"Compliance",title:"If you employ people, your relevant employer registrations and records are in order.",detail:"Some programmes request UIF or other labour-compliance evidence.",weight:4,fix:"Bring the employer records relevant to your business up to date.",allowNA:true},
 {id:"records",group:"Financial readiness",title:"You can show reliable recent sales, expense and cash-flow records.",detail:"Funders need evidence that the business is economically active and that the funding request is viable.",weight:10,critical:true,fix:"Build clean monthly income, expense and cash-flow records before applying."},
 {id:"financials",group:"Financial readiness",title:"You have the financial statements, management accounts or projections appropriate to your stage.",detail:"The exact period and document type varies by programme and whether the business is established or a start-up.",weight:8,fix:"Prepare current management information and realistic projections, and check the programme checklist for the exact period required."},
 {id:"amount",group:"Funding case",title:"You know exactly how much funding you need and what the money will pay for.",detail:"A costed use-of-funds plan is stronger than a general request for money to grow.",weight:10,critical:true,fix:"Create a line-by-line funding requirement covering equipment, stock, working capital, suppliers and other justified uses."},
 {id:"evidence",group:"Funding case",title:"You can support the amount with quotations, supplier prices, a purchase order or other credible evidence.",detail:"Supporting evidence makes the requested amount defendable and is explicitly required by some programmes.",weight:8,fix:"Collect current quotations, pro-forma invoices, contracts, purchase orders or other evidence relevant to the request."},
 {id:"repayment",group:"Funding case",title:"If the funding includes a loan, your cash flow can show how repayments would be made.",detail:"Loan funding is normally assessed for viability and repayment capacity. Pure grant programmes may use different tests.",weight:8,critical:true,fix:"Build a conservative cash-flow forecast including the proposed repayment.",allowNA:true},
 {id:"market",group:"Commercial readiness",title:"You can show credible demand for what the business sells.",detail:"Orders, contracts, invoices, repeat customers or a realistic route to market help prove the business case.",weight:7,fix:"Collect evidence of demand and explain how the funding will convert into sales or delivery capacity."},
 {id:"capability",group:"Commercial readiness",title:"You can show that you or your team can deliver the plan the funding will support.",detail:"Experience, supplier arrangements, operating history and delivery capability reduce execution risk.",weight:6,fix:"Prepare a short capability record covering relevant experience, suppliers, references and delivery resources."},
 {id:"documents",group:"Application readiness",title:"Your core application documents are organised and tell the same story.",detail:"Names, ownership, banking, tax, financial records and supporting evidence should be consistent.",weight:5,fix:"Create one funding folder and resolve inconsistent names, dates, addresses or ownership details before submitting."}
];

const VALUE: Record<Answer,number> = { yes:1, partial:.5, no:0, na:0 };

export default function FundingReadinessCalculator(){
 const [answers,setAnswers]=useState<Record<string,Answer>>({});
 const [shareStatus,setShareStatus]=useState("");
 const groups=[...new Set(CHECKS.map(c=>c.group))];
 const answered=CHECKS.filter(c=>answers[c.id]).length;
 const result=useMemo(()=>{
   const applicable=CHECKS.filter(c=>answers[c.id]!=="na");
   const max=applicable.reduce((s,c)=>s+c.weight,0);
   const earned=applicable.reduce((s,c)=>s+c.weight*(answers[c.id]?VALUE[answers[c.id]]:0),0);
   const score=max?Math.round(earned/max*100):0;
   const gaps=applicable.filter(c=>answers[c.id]==="no"||answers[c.id]==="partial").sort((a,b)=>(Number(b.critical)-Number(a.critical))||b.weight-a.weight);
   return {score,gaps};
 },[answers]);
 const complete=answered===CHECKS.length;
 const band=result.score>=85?"Strong preparation":result.score>=70?"Good base — close the gaps":result.score>=50?"Needs work before applying":"Build the foundation first";
 function buildReport():PdfReport {
  return {
   title:"Funding Readiness Assessment",
   subtitle:"South African small-business preparation report",
   summary:[`Readiness score: ${result.score}/100`,band],
   sections:[
    {heading:"Priority action plan",rows:result.gaps.length?result.gaps.slice(0,8).map((g,i)=>[`${i+1}. ${g.title}`,g.fix] as [string,string]):[["Status","No major preparation gaps were flagged by your answers. Check the exact funder's current criteria before applying."]]},
    {heading:"Assessment",rows:CHECKS.map(q=>[q.title,answers[q.id]==="yes"?"Ready":answers[q.id]==="partial"?"Partly ready":answers[q.id]==="na"?"Not applicable":"Gap"])}
   ],
   footer:"This is a preparation score, not an approval prediction. Each funder applies its own eligibility, affordability and due-diligence rules."
  };
 }
 async function shareResult(){
  const gapText=result.gaps.slice(0,3).map((g,i)=>`${i+1}. ${g.title}`).join("\n");
  const text=`Funding Readiness: ${result.score}/100 — ${band}${gapText?"\nPriority gaps:\n"+gapText:""}`;
  const mode=await shareReport(buildReport(),"funding-readiness-report.pdf",text,"https://insights.chesly.tech/calculators/funding-readiness-assessment");
  if(mode!=="cancelled")setShareStatus(mode==="file"?"Report shared.":"Result shared. Use Save / Print for a PDF copy.");
 }
 function printResult(){ if(!printReport(buildReport())) window.print(); }

 return <div className="space-y-5">
  <div className="border border-navy/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
   <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-gold">Funding readiness</p><p className="mt-1 text-sm text-navy/60 dark:text-white/60">{answered} of {CHECKS.length} checks completed</p></div><span className="font-mono text-sm font-bold text-navy dark:text-white">{Math.round(answered/CHECKS.length*100)}%</span></div>
   <div className="mt-3 h-2 bg-navy/10 dark:bg-white/10"><div className="h-2 bg-gold transition-all" style={{width:(answered/CHECKS.length*100)+"%"}} /></div>
  </div>
  {groups.map(group=><section key={group} className="border border-navy/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
   <h2 className="text-lg font-bold text-navy dark:text-white">{group}</h2>
   <div className="mt-2 divide-y divide-navy/10 dark:divide-white/10">{CHECKS.filter(c=>c.group===group).map(c=><div key={c.id} className="py-5">
    <div className="flex gap-3"><p className="flex-1 font-semibold text-navy dark:text-white">{c.title}</p>{c.critical&&<span className="h-fit bg-gold/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gold">High impact</span>}</div>
    <p className="mt-1 text-sm leading-relaxed text-navy/60 dark:text-white/60">{c.detail}</p>
    <div className={"mt-3 grid gap-2 "+(c.allowNA?"grid-cols-2 sm:grid-cols-4":"grid-cols-3")}>
     {(["yes","partial","no",...(c.allowNA?["na" as Answer]:[])] as Answer[]).map(a=><button key={a} type="button" onClick={()=>setAnswers(v=>({...v,[c.id]:a}))} className={"border px-3 py-2 text-xs font-bold uppercase tracking-wide transition "+(answers[c.id]===a?"border-gold bg-gold text-white":"border-navy/15 text-navy hover:border-gold dark:border-white/15 dark:text-white")}>{a==="partial"?"Partly":a==="na"?"N/A":a}</button>)}
    </div>
   </div>)}</div>
  </section>)}
  {complete&&<section className="border-2 border-gold bg-gold/5 p-6">
   <p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Your preparation score</p>
   <div className="mt-2 flex flex-wrap items-end gap-4"><p className="font-mono text-5xl font-extrabold text-navy dark:text-white">{result.score}<span className="text-xl">/100</span></p><p className="pb-1 text-lg font-bold text-navy dark:text-white">{band}</p></div>
   <p className="mt-4 text-sm leading-relaxed text-navy/70 dark:text-white/70">This is a readiness assessment, not an approval prediction. Every funder and programme applies its own eligibility rules, due diligence and affordability tests.</p>
   {result.gaps.length>0&&<div className="mt-6"><h3 className="font-bold text-navy dark:text-white">Your priority action plan</h3><ol className="mt-3 space-y-3">{result.gaps.slice(0,6).map((g,i)=><li key={g.id} className="flex gap-3 text-sm text-navy/70 dark:text-white/70"><strong className="font-mono text-gold">{i+1}.</strong><span><b className="text-navy dark:text-white">{g.title}</b><br/>{g.fix}</span></li>)}</ol></div>}
   <div className="mt-6 flex flex-wrap gap-3 print:hidden"><button type="button" onClick={printResult} className="border border-navy bg-navy px-4 py-3 text-xs font-bold uppercase tracking-wide text-white dark:border-white dark:bg-white dark:text-navy">Save / print result</button><button type="button" onClick={shareResult} className="border border-green-700 px-4 py-3 text-xs font-bold uppercase tracking-wide text-green-700 hover:bg-green-700 hover:text-white">Share result</button><Link href="/tools/income-expense-tracker-south-african-edition" className="bg-gold px-4 py-3 text-xs font-bold uppercase tracking-wide text-white">Improve financial records</Link><Link href="/insights/what-is-purchase-order-funding" className="border border-gold px-4 py-3 text-xs font-bold uppercase tracking-wide text-gold">Explore funding guides</Link><button type="button" onClick={()=>setAnswers({})} className="border border-navy/20 px-4 py-3 text-xs font-bold uppercase tracking-wide text-navy dark:border-white/20 dark:text-white">Start again</button></div>
  </section>}
 </div>;
}
