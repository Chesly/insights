"use client";

export default function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden bg-[#D9A62E] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0F3D3E] hover:bg-[#c69526]"
    >
      {label}
    </button>
  );
}
