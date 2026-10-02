"use client";

import { useMemo, useState } from "react";
import { printReport, shareReport, type PdfReport } from "@/lib/client-report";

const VAT_RATE = 0.15;

function R(v: number): string {
  if (!isFinite(v)) v = 0;
  const neg = v < 0;
  v = Math.round(Math.abs(v));
  const s = v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "-R " : "R ") + s;
}

function pctFmt(v: number): string {
  return (isFinite(v) ? v.toFixed(1) : "0.0") + "%";
}

function inputCls() {
  return "w-full rounded-sm border border-gold/25 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-gold dark:border-gold/30 dark:bg-navy dark:text-white";
}

// Number inputs default to 0. Without this, clicking in and typing inserts
// into the existing "0" (giving e.g. "01000") instead of replacing it —
// the extra zeros users were having to delete by hand. Selecting the whole
// value on focus means any keystroke replaces it instead.
function selectOnFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.select();
}

export default function RetentionCalculator() {
  const [contractValue, setContractValue] = useState<number>(0);
  const [retentionPct, setRetentionPct] = useState<number>(5);
  const [retentionCapPct, setRetentionCapPct] = useState<number>(5);
  const [retentionHeldToDate, setRetentionHeldToDate] = useState<number>(0);
  const [claimValue, setClaimValue] = useState<number>(0);
  const [daysToPay, setDaysToPay] = useState<number>(30);\n  const [firstReleasePct, setFirstReleasePct] = useState<number>(50);

  const result = useMemo(() => {
    const cap = contractValue * (retentionCapPct / 100);
    const remainingCap = Math.max(0, cap - retentionHeldToDate);
    const wanted = claimValue * (retentionPct / 100);
    const retentionThisClaim = Math.min(wanted, remainingCap);

    const netBeforeVat = claimValue - retentionThisClaim;
    const vat = netBeforeVat * VAT_RATE;
    const payable = netBeforeVat + vat;

    const cumulativeRetention = retentionHeldToDate + retentionThisClaim;
    const capReached = cap > 0 && cumulativeRetention >= cap;

    const firstRelease = cumulativeRetention * 0.5;
    const finalRelease = cumulativeRetention - firstRelease;

    const exposure = claimValue * (daysToPay / 30);

    return { cap, retentionThisClaim, netBeforeVat, vat, payable, cumulativeRetention, capReached, firstRelease, finalRelease, exposure };
  }, [contractValue, retentionPct, retentionCapPct, retentionHeldToDate, claimValue, daysToPay, firstReleasePct]);

  function buildReport(): PdfReport {
    return { title:"Retention & Progress Payment Calculation", summary:[`Amount payable this claim: ${R(result.payable)}`,`Retention held this claim: ${R(result.retentionThisClaim)}`,`Cumulative retention: ${R(result.cumulativeRetention)}`], sections:[
      {heading:"Contract assumptions",rows:[["Contract value",R(contractValue)],["Retention per claim",pctFmt(retentionPct)],["Retention cap",pctFmt(retentionCapPct)],["Retention already held",R(retentionHeldToDate)],["First release assumption",pctFmt(firstReleasePct)],["Payment period",daysToPay+" days"]]},
      {heading:"This progress claim",rows:[["Certified value",R(claimValue)],["Retention withheld",R(result.retentionThisClaim)],["Net before VAT",R(result.netBeforeVat)],["VAT",R(result.vat)],["Amount payable",R(result.payable)]]},
      {heading:"Retention position",rows:[["Cumulative retention",R(result.cumulativeRetention)],["First expected release",R(result.firstRelease)],["Remaining expected release",R(result.finalRelease)]]}
    ],footer:"This calculator models the terms you enter. Your signed contract and payment certificate govern the actual retention percentage, cap, VAT treatment and release mechanism." };
  }
  function saveResult(){if(!printReport(buildReport()))window.print();}
  async function shareResult(){await shareReport(buildReport(),"retention-progress-payment.pdf",`Progress payment: ${R(result.payable)} payable; ${R(result.cumulativeRetention)} retention held.`,"https://insights.chesly.tech/calculators/retention-calculator");}

  return (
    <div>
      <section className="border-b border-navy/10 py-8 dark:border-white/10">
        <h2 className="text-lg font-bold text-navy dark:text-white">1. Contract and retention terms</h2>
        <p className="mt-1 text-sm text-navy/60 dark:text-white/50">Enter the retention terms from your signed contract or payment certificate. Different contracts can use different percentages, caps and release mechanisms.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Total contract value (excl. VAT)</label>
            <input type="number" min={0} step={1000} className={inputCls()} value={contractValue} onChange={(e) => setContractValue(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Retention rate per claim (%)</label>
            <input type="number" min={0} max={20} step={0.5} className={inputCls()} value={retentionPct} onChange={(e) => setRetentionPct(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Retention cap (% of contract value)</label>
            <input type="number" min={0} max={20} step={0.5} className={inputCls()} value={retentionCapPct} onChange={(e) => setRetentionCapPct(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
            <p className="mt-1 text-xs text-navy/50 dark:text-white/40">Use the cap stated in your contract. Do not assume a standard percentage applies to every project.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Retention already held to date</label>
            <input type="number" min={0} step={500} className={inputCls()} value={retentionHeldToDate} onChange={(e) => setRetentionHeldToDate(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
          </div>
        </div>
      </section>

      <section className="border-b border-navy/10 py-8 dark:border-white/10">
        <h2 className="text-lg font-bold text-navy dark:text-white">2. This claim</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Value of work certified this claim (excl. VAT)</label>
            <input type="number" min={0} step={500} className={`${inputCls()} text-lg font-semibold`} value={claimValue} onChange={(e) => setClaimValue(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Days until payment (from certificate/invoice)</label>
            <input type="number" min={0} step={5} className={inputCls()} value={daysToPay} onChange={(e) => setDaysToPay(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Value certified this claim</td><td className="py-2 text-right font-bold">{R(claimValue)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Retention withheld this claim ({retentionPct}%)</td><td className="py-2 text-right text-red-700">-{R(result.retentionThisClaim)}</td></tr>
              <tr className="border-b border-navy/10 bg-navy/5 font-bold dark:border-white/10 dark:bg-white/5"><td className="py-2">Net before VAT</td><td className="py-2 text-right">{R(result.netBeforeVat)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">VAT (15%)</td><td className="py-2 text-right">{R(result.vat)}</td></tr>
              <tr className="bg-navy/5 dark:bg-white/5"><td className="p-3 font-bold text-navy dark:text-white">Amount payable this claim</td><td className="p-3 text-right font-mono text-lg font-extrabold text-navy dark:text-white">{R(result.payable)}</td></tr>
            </tbody>
          </table>
        </div>

        {result.capReached && retentionPct > 0 && (
          <p className="mt-3 border-l-4 border-green-700 bg-green-50 px-3 py-2 text-sm dark:bg-green-950/20">
            Retention cap reached — no further retention should be withheld on future claims. Check the certificate matches this.
          </p>
        )}
        {result.exposure > contractValue * 0.15 && result.exposure > 0 && (
          <p className="mt-3 border-l-4 border-amber-600 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/20">
            You&rsquo;re carrying roughly {R(result.exposure)} of unpaid work at any time on this claim cycle. Confirm you have the facility to fund that before the certificate is paid.
          </p>
        )}
      </section>

      <section className="py-8">
        <h2 className="text-lg font-bold text-navy dark:text-white">3. Where the retention stands</h2>
        <p className="mt-1 text-sm text-navy/60 dark:text-white/50">This models the release split you entered above. Check the contract for the actual release events, certification requirements and timing.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="border border-navy/10 p-4 dark:border-white/10">
            <div className="text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-white/40">Cumulative retention held</div>
            <div className="mt-1 font-mono text-2xl font-extrabold text-navy dark:text-white">{R(result.cumulativeRetention)}</div>
            <div className="mt-1 text-xs text-navy/50 dark:text-white/40">of a {pctFmt(retentionCapPct)} cap ({R(result.cap)})</div>
          </div>
          <div className="border border-navy/10 p-4 dark:border-white/10">
            <div className="text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-white/40">First expected release</div>
            <div className="mt-1 font-mono text-2xl font-extrabold text-navy dark:text-white">{R(result.firstRelease)}</div>
          </div>
          <div className="border border-navy/10 p-4 dark:border-white/10">
            <div className="text-xs font-semibold uppercase tracking-wide text-navy/50 dark:text-white/40">Remaining expected release</div>
            <div className="mt-1 font-mono text-2xl font-extrabold text-navy dark:text-white">{R(result.finalRelease)}</div>
          </div>
        </div>
        {claimValue > 0 && <div className="mt-5 flex flex-wrap gap-2 print:hidden"><button type="button" onClick={saveResult} className="border border-gold bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Save / print calculation</button><button type="button" onClick={shareResult} className="border border-green-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-700">Share result</button></div>}\n        <p className="mt-4 text-xs text-navy/50 dark:text-white/40">
          Nothing you type here is sent anywhere — this runs entirely in your browser tab.
        </p>
      </section>
    </div>
  );
}
