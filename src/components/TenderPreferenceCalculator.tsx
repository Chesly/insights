"use client";

import { useMemo, useState } from "react";
import {
  evaluateBids,
  legacyBbeePoints,
  percentPerGoalPoint,
  winningPrice,
  type BidType,
  type Bidder,
  type SystemChoice
} from "@/lib/ppr2022";

type Row = { id: string; name: string; price: string; goals: string };
const initialRows: Row[] = [{ id: "competitor-1", name: "", price: "", goals: "" }];

const money = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0
});
const points = (value: number) => value.toFixed(2);
const exchange = (value: number) => value.toFixed(2) + "%";

function numberValue(value: string): number {
  const parsed = Number(value.replace(/[, ]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function TenderPreferenceCalculator() {
  const [type, setType] = useState<BidType>("expense");
  const [choice, setChoice] = useState<SystemChoice>("field");
  const [myPrice, setMyPrice] = useState("");
  const [myGoals, setMyGoals] = useState("");
  const [rows, setRows] = useState<Row[]>(initialRows);

  const competitors = useMemo<Bidder[]>(() =>
    rows
      .filter((row) => numberValue(row.price) > 0)
      .map((row, index) => ({
        name: row.name.trim() && row.name.trim().toLowerCase() !== "you"
          ? row.name.trim()
          : "Competitor " + (index + 1),
        price: numberValue(row.price),
        goals: numberValue(row.goals)
      })), [rows]);

  const yourBid: Bidder = { name: "You", price: numberValue(myPrice), goals: numberValue(myGoals) };
  const ready = yourBid.price > 0 && competitors.length > 0;
  const evaluation = useMemo(
    () => ready ? evaluateBids([yourBid, ...competitors], type, choice) : null,
    // Inputs are deliberately local state only; nothing is submitted or stored.
    [ready, yourBid.price, yourBid.goals, competitors, type, choice]
  );
  const win = useMemo(
    () => ready ? winningPrice(yourBid, competitors, type, choice) : null,
    [ready, yourBid.price, yourBid.goals, competitors, type, choice]
  );

  function updateRow(id: string, field: keyof Omit<Row, "id">, value: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }
  function loadExample() {
    setType("expense");
    setChoice("field");
    setMyPrice("1050000");
    setMyGoals("12");
    setRows([
      { id: "example-a", name: "Bidder A", price: "1000000", goals: "8" },
      { id: "example-b", name: "Bidder B", price: "1120000", goals: "20" }
    ]);
  }
  function clear() {
    setMyPrice("");
    setMyGoals("");
    setRows(initialRows);
  }

  const selectedSystem = evaluation?.system;
  const yourResult = evaluation?.results[0];

  return (
    <div className="space-y-6">
      <section className="border border-navy/10 p-5 dark:border-white/10 sm:p-6">
        <h2 className="text-lg font-bold text-navy dark:text-white">1. Set the tender rules</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-navy dark:text-white">
            Tender type
            <select value={type} onChange={(event) => setType(event.target.value as BidType)} className="mt-1 block min-h-11 w-full border border-navy/20 bg-white px-3 py-2 font-normal dark:border-white/20 dark:bg-navy">
              <option value="expense">Buying goods or services</option>
              <option value="income">Income-generating contract (e.g. lease or concession)</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-navy dark:text-white">
            Preference-point system
            <select value={choice} onChange={(event) => setChoice(event.target.value as SystemChoice)} className="mt-1 block min-h-11 w-full border border-navy/20 bg-white px-3 py-2 font-normal dark:border-white/20 dark:bg-navy">
              <option value="field">Use acceptable bid field and R50 million threshold</option>
              <option value="80/20">80/20 (as stated in the tender)</option>
              <option value="90/10">90/10 (as stated in the tender)</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-navy/65 dark:text-white/65">
          Use the system named in the tender document. Choose the field option only when the invitation says either 80/20 or 90/10 and the acceptable bids determine which applies.
        </p>
      </section>

      <section className="border border-navy/10 p-5 dark:border-white/10 sm:p-6">
        <h2 className="text-lg font-bold text-navy dark:text-white">2. Enter your bid</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-navy dark:text-white">
            Price, including applicable taxes
            <div className="mt-1 flex min-h-11 border border-navy/20 bg-white dark:border-white/20 dark:bg-navy">
              <span className="flex items-center border-r border-navy/10 px-3 text-navy/60 dark:border-white/10 dark:text-white/60">R</span>
              <input aria-label="Your tender price in rand" type="number" min="0" step="0.01" value={myPrice} onChange={(event) => setMyPrice(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-2 font-normal outline-none" placeholder="0.00" />
            </div>
          </label>
          <label className="block text-sm font-semibold text-navy dark:text-white">
            Specific-goal points you can prove
            <input aria-label="Your specific-goal points" type="number" min="0" step="0.01" value={myGoals} onChange={(event) => setMyGoals(event.target.value)} className="mt-1 block min-h-11 w-full border border-navy/20 bg-white px-3 py-2 font-normal dark:border-white/20 dark:bg-navy" placeholder="0" />
          </label>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-navy/65 dark:text-white/65">
          Enter the points available to your bid under the tender’s stated specific goals and evidence rules. Points are capped at 20 under 80/20 or 10 under 90/10.
        </p>
      </section>

      <section className="border border-navy/10 p-5 dark:border-white/10 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy dark:text-white">3. Add acceptable competing bids</h2>
            <p className="mt-1 text-sm text-navy/65 dark:text-white/65">Only include bids that pass the tender’s mandatory requirements.</p>
          </div>
          <button type="button" onClick={() => setRows((current) => current.length < 9 ? [...current, { id: "competitor-" + Date.now(), name: "", price: "", goals: "" }] : current)} disabled={rows.length >= 9} className="min-h-10 border border-navy/20 px-3 text-sm font-semibold text-navy disabled:opacity-50 dark:border-white/20 dark:text-white">
            Add competitor
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {rows.map((row, index) => (
            <div key={row.id} className="grid gap-3 border-t border-navy/10 pt-4 dark:border-white/10 sm:grid-cols-[1.2fr_1fr_.8fr_auto] sm:items-end">
              <label className="block text-sm font-semibold text-navy dark:text-white">
                Competitor {index + 1} name (optional)
                <input type="text" maxLength={40} value={row.name} onChange={(event) => updateRow(row.id, "name", event.target.value)} className="mt-1 block min-h-11 w-full border border-navy/20 bg-white px-3 py-2 font-normal dark:border-white/20 dark:bg-navy" placeholder={"Competitor " + (index + 1)} />
              </label>
              <label className="block text-sm font-semibold text-navy dark:text-white">
                Price, including applicable taxes
                <input type="number" min="0" step="0.01" value={row.price} onChange={(event) => updateRow(row.id, "price", event.target.value)} className="mt-1 block min-h-11 w-full border border-navy/20 bg-white px-3 py-2 font-normal dark:border-white/20 dark:bg-navy" placeholder="R0.00" />
              </label>
              <label className="block text-sm font-semibold text-navy dark:text-white">
                Specific-goal points
                <input type="number" min="0" step="0.01" value={row.goals} onChange={(event) => updateRow(row.id, "goals", event.target.value)} className="mt-1 block min-h-11 w-full border border-navy/20 bg-white px-3 py-2 font-normal dark:border-white/20 dark:bg-navy" placeholder="0" />
              </label>
              <button type="button" disabled={rows.length <= 1} onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="min-h-10 px-2 text-sm text-navy/70 underline disabled:opacity-40 dark:text-white/70">Remove</button>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={loadExample} className="min-h-10 border border-navy/20 px-3 text-sm font-semibold dark:border-white/20">Load example</button>
          <button type="button" onClick={clear} className="min-h-10 border border-navy/20 px-3 text-sm font-semibold dark:border-white/20">Clear all</button>
        </div>
      </section>

      <section aria-live="polite" aria-label="Tender preference points results" className="space-y-4">
        {!ready && <div className="border border-navy/10 p-5 text-sm text-navy/65 dark:border-white/10 dark:text-white/65">Enter your price and at least one acceptable competitor price to see the score.</div>}
        {ready && evaluation && !selectedSystem && <div role="alert" className="border border-red-300 bg-red-50 p-5 text-sm text-red-900">Enter valid positive bid prices to calculate the scores.</div>}
        {ready && evaluation && selectedSystem && yourResult && (
          <>
            <div className="border-l-4 border-gold bg-gold/5 p-5">
              <p className="text-2xl font-bold text-navy dark:text-white">{selectedSystem.name} scoring</p>
              <p className="mt-2 text-sm leading-relaxed text-navy/75 dark:text-white/75">
                {type === "income" ? "Highest acceptable bid" : "Lowest acceptable bid"}: {money.format(evaluation.referencePrice)}. The system awards {selectedSystem.price} points to price and up to {selectedSystem.goals} points to specific goals.
              </p>
            </div>

            <div className="overflow-x-auto border border-navy/10 dark:border-white/10">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead className="bg-navy/5 text-xs uppercase tracking-wide text-navy/65 dark:bg-white/5 dark:text-white/65">
                  <tr><th className="px-4 py-3">Rank</th><th className="px-4 py-3">Bidder</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Price points</th><th className="px-4 py-3">Goal points</th><th className="px-4 py-3">Total</th></tr>
                </thead>
                <tbody>
                  {evaluation.ranked.map((bid) => (
                    <tr key={bid.index} className={bid.index === 0 ? "border-t border-gold/30 bg-gold/5 font-semibold" : "border-t border-navy/10 dark:border-white/10"}>
                      <td className="px-4 py-3">{bid.rank}{bid.tied ? " (tie)" : ""}</td>
                      <td className="px-4 py-3">{bid.index === 0 ? "You" : bid.name}</td>
                      <td className="px-4 py-3 tabular-nums">{money.format(bid.price)}</td>
                      <td className="px-4 py-3 tabular-nums">{points(bid.pricePoints)}</td>
                      <td className="px-4 py-3 tabular-nums">{points(bid.goalPoints)}{bid.goalsCapped ? " (capped)" : ""}</td>
                      <td className="px-4 py-3 tabular-nums">{points(bid.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-3 text-xs text-navy/60 dark:text-white/60">Totals are rounded to two decimal places. If total and specific-goal points are equal, the regulations say the award is decided by drawing lots.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-navy/10 p-5 dark:border-white/10">
                <h3 className="font-bold text-navy dark:text-white">Price against goals</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/70 dark:text-white/70">
                  One specific-goal point equals {exchange(percentPerGoalPoint(selectedSystem))} of price. The exact 80/20 and 90/10 exchange rates are shown to two decimal places.
                </p>
              </div>
              <div className="border border-navy/10 p-5 dark:border-white/10">
                <h3 className="font-bold text-navy dark:text-white">What it takes to lead</h3>
                {!win ? <p className="mt-2 text-sm text-navy/70 dark:text-white/70">These competitor figures do not produce a price at which your bid is guaranteed to rank first. Check your goal points and confirm every bid is acceptable.</p> : (
                  <p className="mt-2 text-sm leading-relaxed text-navy/70 dark:text-white/70">
                    {type === "income" ? "Your bid needs to be at least " + money.format(win.price) + " to rank first." : "Your price can be up to " + money.format(win.price) + " and still rank first."} Competitor figures stay fixed in this estimate.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      <details className="border border-navy/10 p-5 dark:border-white/10">
        <summary className="cursor-pointer font-semibold text-navy dark:text-white">Historic B-BBEE level table (2017 regulations)</summary>
        <p className="mt-3 text-sm leading-relaxed text-navy/65 dark:text-white/65">
          The 2022 regulations do not prescribe B-BBEE status levels as a universal scoring table. This is shown only as a historical reference. Use points only where the current tender document expressly allocates them to a goal and states acceptable proof.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full max-w-lg border-collapse text-sm">
            <thead><tr><th className="border-b p-2 text-left">2017 B-BBEE level</th><th className="border-b p-2 text-left">80/20</th><th className="border-b p-2 text-left">90/10</th></tr></thead>
            <tbody>
              {legacyBbeePoints["80/20"].map((value, index) => (
                <tr key={index} className="border-b border-navy/10 dark:border-white/10"><td className="p-2">{index < 8 ? "Level " + (index + 1) : "Non-compliant"}</td><td className="p-2">{value}</td><td className="p-2">{legacyBbeePoints["90/10"][index]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="text-xs leading-relaxed text-navy/55 dark:text-white/55">
        This tool runs in your browser; it does not save or send your bid figures. It models price and stated specific-goal points only. Functionality, local content, compliance gates, tender-specific conditions, exemptions and other evaluation stages may change the outcome. Always follow the current tender documents.
      </p>
    </div>
  );
}
