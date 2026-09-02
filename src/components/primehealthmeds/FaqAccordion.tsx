"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PhmFaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#0f766e]/10 border border-[#0f766e]/10 bg-white">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-[#111827]">{faq.question}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-[#0f766e] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <p className="px-5 pb-4 text-sm text-[#111827]/70">{faq.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
