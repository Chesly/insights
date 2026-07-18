"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-1.5 border border-gold/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold/10 dark:text-white"
    >
      <ArrowLeft size={14} /> Go Back
    </button>
  );
}
