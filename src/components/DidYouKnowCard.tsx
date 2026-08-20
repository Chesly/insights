import Link from "next/link";
import Image from "next/image";
import type { Fact } from "@/types";

/** Matches ArticleRow's card shape exactly (same aspect ratio, same
    top-left stripe badge convention as the "☕ Coffee" tag). The navy
    gradient is always there; an optional background image sits behind it
    at low opacity so the brand color still dominates and the text stays
    fully legible, whether or not a fact has a photo. */
export default function DidYouKnowCard({ fact }: { fact: Fact }) {
  return (
    <Link href={`/facts/${fact.slug}`} className="group block">
      <div className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-navy to-navy-dark p-4 text-center aspect-[285/200]">
        {fact.image_url && (
          <Image
            src={fact.image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover opacity-20 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-2 top-2 z-10 bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          💡 Did You Know?
        </span>
        <p className="relative z-10 line-clamp-4 text-sm font-semibold leading-snug text-white">
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
