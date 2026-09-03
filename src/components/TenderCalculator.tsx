"use client";

import { useEffect, useMemo, useState } from "react";

type Answer = "yes" | "no" | "unsure" | "na";

interface Criterion {
  id: string;
  w: number;
  gate?: boolean;
  t: string;
  yes: string;
  no: string;
  unsure: string;
}

const CRITERIA: Criterion[] = [
  { id: "mandatory", w: 15, gate: true, t: "Do we meet every mandatory requirement in the tender document?", yes: "Meets the mandatory requirements", no: "Fails one or more mandatory requirements", unsure: "Mandatory requirements not yet fully checked" },
  { id: "certs", w: 10, gate: true, t: "Do we hold the required certifications and registrations (CSD, CIDB grading, tax compliance, B-BBEE, industry bodies)?", yes: "Required certifications in place", no: "Missing a required certification or registration", unsure: "Certification status unconfirmed" },
  { id: "experience", w: 10, t: "Do we have the required track record and references?", yes: "Track record and references available", no: "No comparable experience to show", unsure: "References not yet gathered" },
  { id: "deliver", w: 10, t: "Can we actually deliver this contract to spec?", yes: "Confident we can deliver to spec", no: "Cannot deliver this scope", unsure: "Delivery capability not yet assessed" },
  { id: "margin", w: 10, t: "Is the estimated profit margin acceptable?", yes: "Margin meets our threshold", no: "Margin below what the work is worth", unsure: "Margin not yet calculated" },
  { id: "cashflow", w: 9, t: "Can we finance the work until the client pays?", yes: "Cash flow covered until payment", no: "Cannot fund the work-in-progress", unsure: "Cash-flow requirement needs confirmation" },
  { id: "turnover", w: 8, t: "Do we meet the required annual turnover or financial standing?", yes: "Turnover requirement met", no: "Below the required turnover", unsure: "Turnover requirement unclear" },
  { id: "resources", w: 8, t: "Do we have the people, plant and equipment available for this period?", yes: "People and equipment available", no: "Resources already committed elsewhere", unsure: "Resource availability unconfirmed" },
  { id: "value", w: 7, t: "Is the contract value the right size for our business?", yes: "Contract size fits the business", no: "Contract too large or too small for us", unsure: "Contract size not yet weighed up" },
  { id: "location", w: 6, t: "Is the location practical for us to service?", yes: "Location practical to service", no: "Location impractical to service", unsure: "Travel and site costs not worked out" },
  { id: "time", w: 5, t: "Do we have enough time to prepare a proper submission before closing?", yes: "Enough time to prepare properly", no: "Not enough time to submit properly", unsure: "Preparation time is tight" },
  { id: "strategic", w: 2, t: "Is this tender strategically valuable beyond the profit?", yes: "Strategic value beyond the margin", no: "No strategic value", unsure: "Strategic value unclear" }
];

const VALS: { v: Answer; label: string }[] = [
  { v: "yes", label: "Yes" },
  { v: "no", label: "No" },
  { v: "unsure", label: "Unsure" },
  { v: "na", label: "N/A" }
];

const DIRECT_COSTS = [
  ["c_lab", "Labour"], ["c_mat", "Materials"], ["c_equ", "Equipment"], ["c_tra", "Transport"],
  ["c_sub", "Subcontractors"], ["c_acc", "Accommodation"], ["c_oth", "Other direct"]
] as const;

const OVERHEAD_COSTS = [
  ["o_adm", "Administration"], ["o_ins", "Insurance"], ["o_pro", "Professional fees"],
  ["o_fin", "Finance costs"], ["o_oth", "Other overheads"]
] as const;

function R(v: number): string {
  if (!isFinite(v)) v = 0;
  const neg = v < 0;
  v = Math.round(Math.abs(v));
  const s = v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "-R " : "R ") + s;
}

function pctFmt(v: number): string {
  return (isFinite(v) ? v.toFixed(1) : "0.0") + "%";
}

function band(p: number): { l: string; s: string } {
  if (p >= 80) return { l: "STRONG BID", s: "Everything material checks out. Commit the resources and prepare a proper submission." };
  if (p >= 60) return { l: "CONSIDER BIDDING", s: "Workable, but close the open risks below before you commit a team to it." };
  if (p >= 40) return { l: "HIGH RISK", s: "You would be bidding on hope. Only proceed with a deliberate strategic reason." };
  return { l: "NO-BID", s: "The numbers say walk away and spend the time on a better opportunity." };
}

const btnBase = "text-[13px] px-1 py-2 border border-navy/15 text-navy/60 bg-white rounded-sm cursor-pointer transition-colors hover:border-navy hover:text-navy dark:border-white/15 dark:text-white/60 dark:bg-white/5 dark:hover:border-white dark:hover:text-white";
const btnActive: Record<Answer, string> = {
  yes: "!bg-navy !border-navy !text-white font-semibold dark:!bg-white dark:!border-white dark:!text-navy",
  no: "!bg-red-700 !border-red-700 !text-white font-semibold",
  unsure: "!bg-amber-700 !border-amber-700 !text-white font-semibold",
  na: "!bg-navy/40 !border-navy/40 !text-white font-semibold dark:!bg-white/40 dark:!border-white/40"
};

function inputCls() {
  return "w-full rounded-sm border border-gold/25 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-gold dark:border-gold/30 dark:bg-navy dark:text-white";
}

// Number inputs default to 0. Without this, clicking in and typing "5000"
// inserts into the existing "0" (giving "05000") instead of replacing it —
// the extra zeros users were having to delete by hand. Selecting the whole
// value on focus means any keystroke replaces it instead.
function selectOnFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.select();
}

// Per-tender fields (cleared by "Start a new tender") persist here...
const DRAFT_KEY = "tenderCalc.draft.v1";
// ...while who's using the tool persists separately and survives a reset,
// so a returning visitor never has to retype their own details.
const PROFILE_KEY = "tenderCalc.profile.v1";

interface Draft {
  tName: string; tRef: string; tOrg: string; tClose: string;
  answers: Record<string, Answer>;
  rev: number; months: number; direct: Record<string, number>; overhead: Record<string, number>;
  cont: number; minMargin: number; daysToPay: number; targetMargin: number;
  decision: "follow" | "bid" | "nobid"; reason: string;
}

interface Profile {
  yourCompany: string; decidedBy: string; leadName: string; leadEmail: string;
}

export default function TenderCalculator() {
  const [tName, setTName] = useState("");
  const [tRef, setTRef] = useState("");
  const [tOrg, setTOrg] = useState("");
  const [tClose, setTClose] = useState("");

  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const [rev, setRev] = useState(0);
  const [months, setMonths] = useState(12);
  const [direct, setDirect] = useState<Record<string, number>>({});
  const [overhead, setOverhead] = useState<Record<string, number>>({});
  const [cont, setCont] = useState(5);
  const [minMargin, setMinMargin] = useState(15);
  const [daysToPay, setDaysToPay] = useState(30);
  const [targetMargin, setTargetMargin] = useState(20);

  const [decision, setDecision] = useState<"follow" | "bid" | "nobid">("follow");
  const [reason, setReason] = useState("");
  const [decidedBy, setDecidedBy] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [yourCompany, setYourCompany] = useState("");

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadNewsletter, setLeadNewsletter] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [leadError, setLeadError] = useState("");

  const [hydrated, setHydrated] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  // Restore a saved draft/profile once on mount. Runs before the save
  // effects below start writing (they bail out until `hydrated` is true),
  // so this never gets clobbered by the initial blank render.
  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(PROFILE_KEY);
      if (rawProfile) {
        const p: Partial<Profile> = JSON.parse(rawProfile);
        if (p.yourCompany) setYourCompany(p.yourCompany);
        if (p.decidedBy) setDecidedBy(p.decidedBy);
        if (p.leadName) setLeadName(p.leadName);
        if (p.leadEmail) setLeadEmail(p.leadEmail);
      }
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const d: Partial<Draft> = JSON.parse(rawDraft);
        if (d.tName) setTName(d.tName);
        if (d.tRef) setTRef(d.tRef);
        if (d.tOrg) setTOrg(d.tOrg);
        if (d.tClose) setTClose(d.tClose);
        if (d.answers) setAnswers(d.answers);
        if (d.rev) setRev(d.rev);
        if (d.months) setMonths(d.months);
        if (d.direct) setDirect(d.direct);
        if (d.overhead) setOverhead(d.overhead);
        if (d.cont !== undefined) setCont(d.cont);
        if (d.minMargin !== undefined) setMinMargin(d.minMargin);
        if (d.daysToPay !== undefined) setDaysToPay(d.daysToPay);
        if (d.targetMargin !== undefined) setTargetMargin(d.targetMargin);
        if (d.decision) setDecision(d.decision);
        if (d.reason) setReason(d.reason);
        if (d.tName || d.rev || (d.answers && Object.keys(d.answers).length > 0)) setShowRestored(true);
      }
    } catch {
      // Corrupt or blocked storage (private browsing) — just start blank.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const draft: Draft = { tName, tRef, tOrg, tClose, answers, rev, months, direct, overhead, cont, minMargin, daysToPay, targetMargin, decision, reason };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* private browsing — draft just won't persist */ }
  }, [hydrated, tName, tRef, tOrg, tClose, answers, rev, months, direct, overhead, cont, minMargin, daysToPay, targetMargin, decision, reason]);

  useEffect(() => {
    if (!hydrated) return;
    const profile: Profile = { yourCompany, decidedBy, leadName, leadEmail };
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* private browsing — profile just won't persist */ }
  }, [hydrated, yourCompany, decidedBy, leadName, leadEmail]);

  function toggle(cid: string, v: Answer) {
    setAnswers((prev) => {
      const next = { ...prev };
      if (next[cid] === v) delete next[cid];
      else next[cid] = v;
      return next;
    });
  }

  const scoreResult = useMemo(() => {
    let earned = 0, available = 0, answered = 0;
    const gateFail: string[] = [], strengths: string[] = [], risks: string[] = [];
    CRITERIA.forEach((c) => {
      const a = answers[c.id];
      if (!a) return;
      answered++;
      if (a === "na") return;
      available += c.w;
      if (a === "yes") { earned += c.w; strengths.push(c.yes); }
      else if (a === "unsure") { earned += c.w * 0.5; risks.push(c.unsure); }
      else { risks.push(c.no); if (c.gate) gateFail.push(c.no); }
    });
    return {
      pct: available > 0 ? Math.round((earned / available) * 100) : null,
      answered, total: CRITERIA.length, gateFail, strengths, risks
    };
  }, [answers]);

  const pricingResult = useMemo(() => {
    const d = DIRECT_COSTS.reduce((s, [id]) => s + (direct[id] || 0), 0);
    const o = OVERHEAD_COSTS.reduce((s, [id]) => s + (overhead[id] || 0), 0);
    const base = d + o;
    const contAmt = base * (cont / 100);
    const total = base + contAmt;
    const gp = rev - total;
    const margin = rev > 0 ? (gp / rev) * 100 : 0;
    const markup = total > 0 ? (gp / total) * 100 : 0;
    const target = targetMargin / 100;
    const suggested = target < 0.99 ? total / (1 - target) : 0;
    const m = Math.max(1, months);
    const exposure = (total / m) * (daysToPay / 30);
    return { d, o, base, cont: contAmt, total, gp, margin, markup, suggested, exposure, months: m };
  }, [direct, overhead, rev, months, cont, targetMargin, daysToPay]);

  const deadline = useMemo(() => {
    if (!tClose) return null;
    const d = new Date(tClose + "T23:59:59");
    const now = new Date();
    const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    if (days < 0) return { text: `This tender closed ${Math.abs(days)} day(s) ago.`, urgent: true };
    if (days === 0) return { text: "Closes today.", urgent: true };
    if (days <= 7) return { text: `${days} day(s) until closing. Treat preparation time as a real constraint.`, urgent: true };
    return { text: `${days} day(s) until closing.`, urgent: false };
  }, [tClose]);

  const b = scoreResult.pct !== null ? band(scoreResult.pct) : null;

  function handlePrint() {
    if (decision !== "follow" && !reason.trim()) {
      setReasonError(true);
      return;
    }
    setReasonError(false);
    window.print();
  }

  function buildResultsPayload() {
    const summaryLines: string[] = [];
    if (scoreResult.pct !== null && b) summaryLines.push(`Score: ${scoreResult.pct}/100 — ${b.l}`);
    if (tName) summaryLines.push(`Tender: ${tName}`);

    const sections: { heading: string; rows: [string, string][] }[] = [];

    if (yourCompany || tName || tRef || tOrg || tClose) {
      sections.push({
        heading: "The tender",
        rows: [
          ...(yourCompany ? ([["Your company", yourCompany]] as [string, string][]) : []),
          ["Name", tName || "—"],
          ["Reference", tRef || "—"],
          ["Issuing organisation", tOrg || "—"],
          ["Closing date", tClose || "—"],
        ],
      });
    }

    if (scoreResult.strengths.length > 0) {
      sections.push({ heading: "Strengths", rows: scoreResult.strengths.map((s) => ["✓", s] as [string, string]) });
    }
    if (scoreResult.risks.length > 0) {
      sections.push({ heading: "Risks and gaps", rows: scoreResult.risks.map((s) => ["!", s] as [string, string]) });
    }

    sections.push({
      heading: "Price and profitability",
      rows: [
        ["Tender price", R(rev)],
        ["Total direct cost", R(pricingResult.d)],
        ["Total overhead", R(pricingResult.o)],
        [`Contingency (${cont}%)`, R(pricingResult.cont)],
        ["Total estimated cost", R(pricingResult.total)],
        ["Gross profit", R(pricingResult.gp)],
        ["Gross margin", pctFmt(pricingResult.margin)],
        ["Markup on cost", pctFmt(pricingResult.markup)],
        [`Price for a ${targetMargin}% margin`, R(pricingResult.suggested)],
        ["Cash you must carry before payment", R(pricingResult.exposure)],
      ],
    });

    const decisionRows: [string, string][] = [
      ["Final decision", decision === "follow" ? "Accept the recommendation" : decision === "bid" ? "Override — bidding anyway" : "Override — not bidding"],
    ];
    if (reason) decisionRows.push(["Reason", reason]);
    if (decidedBy) decisionRows.push(["Decided by", decidedBy]);
    sections.push({ heading: "Decision", rows: decisionRows });

    return { calculatorTitle: "Bid/No-Bid Tender Calculator", summaryLines, sections };
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadStatus("sending");
    setLeadError("");
    try {
      const res = await fetch("/api/public/calculators/tender-bid-no-bid/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: leadName, email: leadEmail, newsletterOptIn: leadNewsletter, ...buildResultsPayload() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setLeadStatus("sent");
    } catch (err) {
      setLeadStatus("error");
      setLeadError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    }
  }

  function handleReset() {
    if (!confirm("Clear everything and start a new tender?")) return;
    setTName(""); setTRef(""); setTOrg(""); setTClose("");
    setAnswers({});
    setRev(0); setMonths(12); setDirect({}); setOverhead({});
    setCont(5); setMinMargin(15); setDaysToPay(30); setTargetMargin(20);
    setDecision("follow"); setReason(""); setReasonError(false);
    // Your company / decided-by / email-me details are deliberately kept —
    // only the tender-specific fields reset, per DRAFT_KEY above.
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* private browsing */ }
    setShowRestored(false);
    window.scrollTo(0, 0);
  }

  function buildWhatsAppText(): string {
    const lines: string[] = [`*${tName || "Tender bid/no-bid result"}*`];
    if (scoreResult.pct !== null && b) lines.push(`Score: ${scoreResult.pct}/100 — ${b.l}`);
    if (rev > 0) {
      lines.push(`Tender price: ${R(rev)}`);
      lines.push(`Estimated margin: ${pctFmt(pricingResult.margin)}`);
    }
    const decisionLabel = decision === "follow" ? (b ? b.l : "Not yet scored") : decision === "bid" ? "Bidding (override)" : "Not bidding (override)";
    lines.push(`Decision: ${decisionLabel}`);
    lines.push("");
    lines.push("Scored free with the Bid/No-Bid Tender Calculator:");
    lines.push("https://insights.chesly.tech/calculators/tender-bid-no-bid");
    return lines.join("\n");
  }

  return (
    <div>
      {/* Restored draft notice */}
      {showRestored && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-gold/30 bg-gold/10 px-4 py-3 print:hidden">
          <p className="text-sm text-navy dark:text-white">Welcome back — we restored your unfinished tender.</p>
          <button type="button" onClick={handleReset} className="text-xs font-semibold uppercase tracking-wide text-navy underline underline-offset-2 dark:text-white">
            Not this one? Start fresh
          </button>
        </div>
      )}

      {/* 1. Tender */}
      <section className="border-b border-navy/10 py-8 dark:border-white/10">
        <h2 className="text-lg font-bold text-navy dark:text-white">1. The tender</h2>
        <p className="mt-1 text-sm text-navy/60 dark:text-white/50">Used on your printed decision record.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Your company <span className="font-normal text-navy/40 dark:text-white/40">(remembered for next time)</span></label>
            <input className={inputCls()} value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} placeholder="Your company name" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Tender name</label>
            <input className={inputCls()} value={tName} onChange={(e) => setTName(e.target.value)} placeholder="Cleaning services — Regional Offices" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Reference number</label>
            <input className={inputCls()} value={tRef} onChange={(e) => setTRef(e.target.value)} placeholder="TSH/2026/0417" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Issuing organisation</label>
            <input className={inputCls()} value={tOrg} onChange={(e) => setTOrg(e.target.value)} placeholder="City of Tshwane" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Closing date</label>
            <input type="date" className={inputCls()} value={tClose} onChange={(e) => setTClose(e.target.value)} />
          </div>
        </div>
        {deadline && (
          <p className={`mt-2 text-sm ${deadline.urgent ? "font-semibold text-red-700" : "text-navy/50 dark:text-white/40"}`}>{deadline.text}</p>
        )}
      </section>

      {/* 2. Qualify */}
      <section className="border-b border-navy/10 py-8 dark:border-white/10">
        <h2 className="text-lg font-bold text-navy dark:text-white">2. Qualify the opportunity</h2>
        <p className="mt-1 text-sm text-navy/60 dark:text-white/50">Answer honestly. &ldquo;Unsure&rdquo; scores half — it is not a free pass, it is a task you still have to do.</p>
        <div className="mt-4 divide-y divide-navy/10 dark:divide-white/10">
          {CRITERIA.map((c, i) => (
            <div key={c.id} className="py-3">
              <div className="flex items-baseline gap-3">
                <span className="w-8 flex-none font-mono text-xs text-navy/40 dark:text-white/30">2.{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-navy dark:text-white">
                  {c.t}
                  {c.gate && <span className="mt-0.5 block text-xs font-semibold text-red-700">Mandatory — a &ldquo;No&rdquo; here disqualifies the bid</span>}
                </span>
                <span className="flex-none text-xs text-navy/40 dark:text-white/30">{c.w}</span>
              </div>
              <div className="ml-11 mt-2 grid grid-cols-4 gap-1.5">
                {VALS.map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => toggle(c.id, opt.v)}
                    className={`${btnBase} ${answers[c.id] === opt.v ? btnActive[opt.v] : ""}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why */}
      <section className="border-b border-navy/10 py-8 dark:border-white/10">
        <h2 className="text-lg font-bold text-navy dark:text-white">3. Why the calculator says this</h2>
        <p className="mt-1 text-sm text-navy/60 dark:text-white/50">Every strength and risk below traces back to an answer you gave.</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold text-navy dark:text-white">Strengths</h3>
            {scoreResult.strengths.length === 0 ? (
              <p className="mt-2 text-sm italic text-navy/40 dark:text-white/30">Nothing confirmed yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-navy/10 text-sm dark:divide-white/10">
                {scoreResult.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 py-1.5"><span className="font-bold text-green-700">✓</span>{s}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy dark:text-white">Risks and gaps</h3>
            {scoreResult.risks.length === 0 ? (
              <p className="mt-2 text-sm italic text-navy/40 dark:text-white/30">Nothing flagged yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-navy/10 text-sm dark:divide-white/10">
                {scoreResult.risks.map((s, i) => (
                  <li key={i} className="flex gap-2 py-1.5"><span className="font-bold text-amber-700">!</span>{s}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {scoreResult.gateFail.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-navy dark:text-white">Disqualifiers</h3>
            <ul className="mt-2 divide-y divide-navy/10 text-sm dark:divide-white/10">
              {scoreResult.gateFail.map((s, i) => (
                <li key={i} className="flex gap-2 py-1.5"><span className="font-bold text-red-700">✕</span>{s}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-navy/50 dark:text-white/40">A disqualifier means the bid is likely to be thrown out on compliance before anyone reads your price. Fix it or walk away.</p>
          </div>
        )}
      </section>

      {/* 4. Pricing */}
      <section className="border-b border-navy/10 py-8 dark:border-white/10">
        <h2 className="text-lg font-bold text-navy dark:text-white">4. Price and profitability</h2>
        <p className="mt-1 text-sm text-navy/60 dark:text-white/50">All figures in rand, excluding VAT. Leave anything that doesn&rsquo;t apply at zero.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Tender price (your bid, excl. VAT)</label>
            <input type="number" min={0} step={1000} className={inputCls()} value={rev} onChange={(e) => setRev(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Contract duration (months)</label>
            <input type="number" min={1} step={1} className={inputCls()} value={months} onChange={(e) => setMonths(Number(e.target.value) || 1)} onFocus={selectOnFocus} />
          </div>
        </div>

        <fieldset className="mt-4 rounded-sm border border-navy/10 p-4 dark:border-white/10">
          <legend className="px-1 text-sm font-bold text-navy dark:text-white">Direct costs</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {DIRECT_COSTS.map(([id, label]) => (
              <div key={id}>
                <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">{label}</label>
                <input type="number" min={0} step={500} className={inputCls()} value={direct[id] || 0} onChange={(e) => setDirect((p) => ({ ...p, [id]: Number(e.target.value) || 0 }))} onFocus={selectOnFocus} />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4 rounded-sm border border-navy/10 p-4 dark:border-white/10">
          <legend className="px-1 text-sm font-bold text-navy dark:text-white">Overheads</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {OVERHEAD_COSTS.map(([id, label]) => (
              <div key={id}>
                <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">{label}</label>
                <input type="number" min={0} step={500} className={inputCls()} value={overhead[id] || 0} onChange={(e) => setOverhead((p) => ({ ...p, [id]: Number(e.target.value) || 0 }))} onFocus={selectOnFocus} />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4 rounded-sm border border-navy/10 p-4 dark:border-white/10">
          <legend className="px-1 text-sm font-bold text-navy dark:text-white">Assumptions</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Contingency held back (% of cost)</label>
              <input type="number" min={0} max={50} step={0.5} className={inputCls()} value={cont} onChange={(e) => setCont(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Minimum acceptable margin (%)</label>
              <input type="number" min={0} max={90} step={0.5} className={inputCls()} value={minMargin} onChange={(e) => setMinMargin(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Days until client pays (from invoice)</label>
              <input type="number" min={0} step={5} className={inputCls()} value={daysToPay} onChange={(e) => setDaysToPay(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Target margin for suggested price (%)</label>
              <input type="number" min={0} max={90} step={0.5} className={inputCls()} value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value) || 0)} onFocus={selectOnFocus} />
            </div>
          </div>
          <p className="mt-2 text-xs text-navy/50 dark:text-white/40">Suggested price works backwards from your target margin, including contingency. Use it as a floor, not a quote.</p>
        </fieldset>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Tender price</td><td className="py-2 text-right font-bold">{R(rev)}</td></tr>
              <tr className="bg-navy/5 dark:bg-white/5"><td className="py-1.5 px-2 text-xs font-bold uppercase tracking-wide text-navy dark:text-white" colSpan={2}>Costs</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Total direct cost</td><td className="py-2 text-right">{R(pricingResult.d)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Total overhead</td><td className="py-2 text-right">{R(pricingResult.o)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Contingency ({cont}%)</td><td className="py-2 text-right">{R(pricingResult.cont)}</td></tr>
              <tr className="border-b border-navy/10 bg-navy/5 font-bold dark:border-white/10 dark:bg-white/5"><td className="py-2">Total estimated cost</td><td className="py-2 text-right">{R(pricingResult.total)}</td></tr>
              <tr className="bg-navy/5 dark:bg-white/5"><td className="py-1.5 px-2 text-xs font-bold uppercase tracking-wide text-navy dark:text-white" colSpan={2}>Result</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Gross profit</td><td className={`py-2 text-right font-semibold ${pricingResult.gp >= 0 ? "text-green-700" : "text-red-700"}`}>{R(pricingResult.gp)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Gross margin</td><td className={`py-2 text-right font-semibold ${pricingResult.margin >= minMargin ? "text-green-700" : "text-red-700"}`}>{pctFmt(pricingResult.margin)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Markup on cost</td><td className="py-2 text-right">{pctFmt(pricingResult.markup)}</td></tr>
              <tr className="bg-navy/5 dark:bg-white/5"><td className="py-1.5 px-2 text-xs font-bold uppercase tracking-wide text-navy dark:text-white" colSpan={2}>Per month over {pricingResult.months} months</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Revenue</td><td className="py-2 text-right">{R(rev / pricingResult.months)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Cost</td><td className="py-2 text-right">{R(pricingResult.total / pricingResult.months)}</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Profit</td><td className={`py-2 text-right font-semibold ${pricingResult.gp >= 0 ? "text-green-700" : "text-red-700"}`}>{R(pricingResult.gp / pricingResult.months)}</td></tr>
              <tr className="bg-navy/5 dark:bg-white/5"><td className="py-1.5 px-2 text-xs font-bold uppercase tracking-wide text-navy dark:text-white" colSpan={2}>Working backwards</td></tr>
              <tr className="border-b border-navy/10 dark:border-white/10"><td className="py-2">Price for a {targetMargin}% margin</td><td className="py-2 text-right font-bold">{R(pricingResult.suggested)}</td></tr>
              <tr><td className="py-2">Cash you must carry before payment</td><td className="py-2 text-right">{R(pricingResult.exposure)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 space-y-2">
          {rev > 0 && pricingResult.total > rev && (
            <p className="border-l-4 border-red-700 bg-red-50 px-3 py-2 text-sm dark:bg-red-950/30">Your costs exceed the tender price by {R(pricingResult.total - rev)}. You would be paying the client to do the work.</p>
          )}
          {rev > 0 && pricingResult.total <= rev && pricingResult.margin < minMargin && (
            <p className="border-l-4 border-amber-600 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/20">Margin of {pctFmt(pricingResult.margin)} is below your {minMargin}% threshold. You need {R(pricingResult.suggested - rev)} more on the price to hit {targetMargin}%.</p>
          )}
          {rev > 0 && pricingResult.margin >= minMargin && pricingResult.margin < minMargin + 5 && (
            <p className="border-l-4 border-amber-600 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/20">Margin is only just above your threshold. One delay or one price increase wipes it out.</p>
          )}
          {cont < 5 && rev > 0 && (
            <p className="border-l-4 border-amber-600 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/20">Contingency below 5% leaves almost no room for scope creep, fuel increases or a slow payer.</p>
          )}
          {pricingResult.exposure > 0 && rev > 0 && pricingResult.exposure > rev * 0.25 && (
            <p className="border-l-4 border-amber-600 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/20">You must carry roughly {R(pricingResult.exposure)} before the first payment lands — over a quarter of the contract value. Confirm the facility before you bid.</p>
          )}
          {pricingResult.margin > 45 && rev > 0 && (
            <p className="border-l-4 border-amber-600 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/20">A margin above 45% on a public tender usually means a cost line is missing, not that you found a bargain.</p>
          )}
        </div>
      </section>

      {/* 5. Decision */}
      <section className="py-8">
        <h2 className="text-lg font-bold text-navy dark:text-white">5. Your decision</h2>
        <p className="mt-1 text-sm text-navy/60 dark:text-white/50">You can overrule the calculator. It just wants the reason on record.</p>
        <div className="mt-4 max-w-sm">
          <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Final decision</label>
          <select className={inputCls()} value={decision} onChange={(e) => setDecision(e.target.value as typeof decision)}>
            <option value="follow">Accept the recommendation</option>
            <option value="bid">Override — we are bidding anyway</option>
            <option value="nobid">Override — we are not bidding</option>
          </select>
        </div>
        {decision !== "follow" && (
          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
              Reason for overriding <span className="text-red-700">— required</span>
            </label>
            <textarea rows={3} className={inputCls()} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Strategic entry into municipal work; accepting 9% margin to build a reference for the next three years." />
            {reasonError && <p className="mt-1 text-xs text-red-700">An override without a reason is just a guess. Write one line.</p>}
          </div>
        )}
        <div className="mt-4 max-w-sm">
          <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">Decision made by <span className="font-normal text-navy/40 dark:text-white/40">(remembered for next time)</span></label>
          <input className={inputCls()} value={decidedBy} onChange={(e) => setDecidedBy(e.target.value)} placeholder="Name and role" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 print:hidden">
          <button type="button" onClick={handlePrint} className="border border-gold bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold-dark">
            Print decision record
          </button>
          <button type="button" onClick={handleReset} className="border border-navy px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy/5 dark:border-white dark:text-white dark:hover:bg-white/10">
            Start a new tender
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(buildWhatsAppText())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-green-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-700 transition-colors hover:bg-green-700 hover:text-white"
          >
            Share on WhatsApp
          </a>
        </div>

        {/* Optional — get a copy by email */}
        <div className="mt-4 border border-gold/20 bg-gold/5 p-4 print:hidden">
          {leadStatus === "sent" ? (
            <p className="text-sm font-semibold text-navy dark:text-white">✓ Sent — check {leadEmail} for a copy of these results.</p>
          ) : !showEmailForm ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-navy/70 dark:text-white/70">Want a copy of these results in your inbox? Totally optional.</p>
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="border border-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-white"
              >
                Email me these results
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <p className="text-sm font-semibold text-navy dark:text-white">Email me these results</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <input required placeholder="Your name" value={leadName} onChange={(e) => setLeadName(e.target.value)} className={inputCls()} />
                <input required type="email" placeholder="Email address" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className={inputCls()} />
              </div>
              <label className="flex items-start gap-2 text-xs text-navy/70 dark:text-white/70">
                <input type="checkbox" checked={leadNewsletter} onChange={(e) => setLeadNewsletter(e.target.checked)} className="mt-0.5" />
                Also send me occasional tips and new tools <span className="font-normal text-navy/40 dark:text-white/40">(optional)</span>
              </label>
              {leadStatus === "error" && <p className="text-xs text-red-700">{leadError}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowEmailForm(false)} className="border border-navy/20 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5 dark:border-white/20 dark:text-white">
                  Cancel
                </button>
                <button type="submit" disabled={leadStatus === "sending"} className="flex-1 bg-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark disabled:opacity-60">
                  {leadStatus === "sending" ? "Sending…" : "Send my results"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-3 text-xs text-navy/50 dark:text-white/40">Nothing you type here is sent anywhere unless you choose to email yourself a copy above. Everything is remembered in this browser only, so you can pick up where you left off next time — &ldquo;Start a new tender&rdquo; clears this tender&rsquo;s details but keeps your company and decision-maker filled in for the next one.</p>
      </section>

      {/* Sticky verdict bar */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t-4 border-gold bg-navy-dark px-4 py-4 shadow-[0_-6px_24px_rgba(19,30,54,0.28)] print:hidden sm:-mx-6 lg:-mx-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
          <div className="font-mono text-4xl font-extrabold leading-none text-gold-light">
            {scoreResult.pct ?? "—"}<small className="ml-1 text-base font-medium text-white/40">/100</small>
          </div>
          <div>
            <div className="text-lg font-bold leading-tight text-white">{b ? b.l : "Answer the questions"}</div>
            <div className="max-w-md text-xs text-white/60">
              {scoreResult.pct !== null && scoreResult.answered < scoreResult.total ? `Provisional — ${scoreResult.total - scoreResult.answered} question(s) still unanswered. ` : ""}
              {b ? b.s : "Your score updates as you go."}
            </div>
          </div>
          <div className="ml-auto text-right text-xs text-white/50">{scoreResult.answered} of {scoreResult.total} answered</div>
        </div>
        <div className="mx-auto mt-3 h-1.5 max-w-6xl bg-white/10">
          <div className="h-full bg-gold-light transition-[width] duration-200" style={{ width: `${scoreResult.pct ?? 0}%` }} />
        </div>
        {scoreResult.gateFail.length > 0 && (
          <div className="mx-auto mt-3 max-w-6xl bg-red-700 px-3 py-2 text-sm font-medium text-white">
            <strong>Disqualified on compliance.</strong> {scoreResult.gateFail.join(". ")}. Regardless of the score above, this bid is likely to be rejected before your price is opened.
          </div>
        )}
      </div>
    </div>
  );
}
