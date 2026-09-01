"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#B8860B]/15 border border-[#B8860B]/15 bg-white">
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
              <span className="font-semibold text-[#1A1A1A]">{faq.question}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-[#B8860B] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <p className="px-5 pb-4 text-sm text-[#1A1A1A]/70">{faq.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
