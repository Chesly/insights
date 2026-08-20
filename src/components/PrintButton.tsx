"use client";

export default function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark"
    >
      {label}
    </button>
  );
}
