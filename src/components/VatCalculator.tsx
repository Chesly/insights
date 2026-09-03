"use client";

import { useMemo, useState } from "react";

const VAT_RATE = 15;

function R(v: number): string {
  if (!isFinite(v)) v = 0;
  const neg = v < 0;
  v = Math.abs(v);
  const [whole, cents] = v.toFixed(2).split(".");
  const s = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "-R " : "R ") + s + "." + cents;
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

export default function VatCalculator() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(VAT_RATE);

  const result = useMemo(() => {
    const r = rate / 100;
    if (mode === "add") {
      const excl = amount;
      const vat = excl * r;
      const incl = excl + vat;
      return { excl, vat, incl };
    }
    const incl = amount;
    const excl = incl / (1 + r);
    const vat = incl - excl;
    return { excl, vat, incl };
  }, [amount, mode, rate]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
            I have an amount that&hellip;
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setMode("add")}
              className={`rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
                mode === "add"
                  ? "border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy"
                  : "border-navy/15 text-navy/60 hover:border-navy dark:border-white/15 dark:text-white/60 dark:hover:border-white"
              }`}
            >
              Excludes VAT
            </button>
            <button
              type="button"
              onClick={() => setMode("remove")}
              className={`rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
                mode === "remove"
                  ? "border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy"
                  : "border-navy/15 text-navy/60 hover:border-navy dark:border-white/15 dark:text-white/60 dark:hover:border-white"
              }`}
            >
              Includes VAT
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">VAT rate (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            className={inputCls()}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
            onFocus={selectOnFocus}
          />
          {rate !== VAT_RATE && (
            <p className="mt-1 text-xs text-amber-700">
              South Africa&rsquo;s standard rate is {VAT_RATE}%. Only change this if you have a specific reason to.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-navy/60 dark:text-white/50">
          Amount {mode === "add" ? "(excl. VAT)" : "(incl. VAT)"}
        </label>
        <input
          type="number"
          min={0}
          step={100}
          className={`${inputCls()} text-lg font-semibold`}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          onFocus={selectOnFocus}
          placeholder="0.00"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-sm border border-navy/10 dark:border-white/10">
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b border-navy/10 dark:border-white/10">
              <td className="p-3">Amount excluding VAT</td>
              <td className="p-3 text-right font-medium">{R(result.excl)}</td>
            </tr>
            <tr className="border-b border-navy/10 dark:border-white/10">
              <td className="p-3">VAT ({rate}%)</td>
              <td className="p-3 text-right font-medium">{R(result.vat)}</td>
            </tr>
            <tr className="bg-navy/5 dark:bg-white/5">
              <td className="p-3 font-bold text-navy dark:text-white">Amount including VAT</td>
              <td className="p-3 text-right font-mono text-lg font-extrabold text-navy dark:text-white">
                {R(result.incl)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-navy/50 dark:text-white/40">
        Nothing you type here is sent anywhere — this runs entirely in your browser tab.
      </p>
    </div>
  );
}
