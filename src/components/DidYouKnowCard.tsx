import Link from "next/link";
import type { Fact } from "@/types";

/** Matches ArticleRow's card shape exactly (same aspect ratio, same
    top-left stripe badge convention as the "☕ Coffee" tag) but swaps the
    photo for a brand gradient — facts don't have a per-item image library
    to draw on — and the category label for a "Find Out More" CTA. */
export default function DidYouKnowCard({ fact }: { fact: Fact }) {
  return (
    <Link href={`/facts/${fact.slug}`} className="group block">
      <div className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-navy to-navy-dark p-4 text-center aspect-[285/200]">
        <span className="absolute left-2 top-2 bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          💡 Did You Know?
        </span>
        <p className="line-clamp-4 text-sm font-semibold leading-snug text-white transition-transform duration-500 group-hover:scale-105">
          {fact.fact_text}
        </p>
      </div>
      <div className="pt-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">
          {fact.category || "Did You Know?"}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-navy group-hover:text-gold dark:text-white">
          {fact.headline}
        </h3>
        <span className="mt-1 inline-block text-xs font-semibold text-gold group-hover:underline">
          Find Out More →
        </span>
      </div>
    </Link>
  );
}
