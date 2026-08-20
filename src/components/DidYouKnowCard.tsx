import Link from "next/link";
import Image from "next/image";
import type { Fact } from "@/types";

/** Full-width banner, not a grid cell — squeezing this into one slot of
    the 4-post "Latest" grid broke badly on mobile (2-column grid meant
    it fought the other 3 posts for space and got cramped/overlapping
    text). Sits on its own, same position on both mobile and desktop for
    simplicity. No fixed aspect ratio, so it reads fine in any orientation
    instead of being locked to a box shaped for a photo. The navy
    gradient is always there; a background image — the widget's own
    consistent look (site_settings.facts_widget_bg_image), not a
    per-fact photo — sits behind it at 40% opacity so navy still reads
    as the dominant color (~60%). */
export default function DidYouKnowCard({ fact, backgroundImage }: { fact: Fact; backgroundImage?: string }) {
  return (
    <Link
      href={`/facts/${fact.slug}`}
      className="group relative mb-5 block overflow-hidden bg-gradient-to-br from-navy to-navy-dark p-6 sm:mb-6 sm:p-8"
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <span className="relative z-10 inline-block bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        💡 Did You Know?
      </span>
      <p className="relative z-10 mt-3 max-w-2xl text-base font-semibold leading-snug text-white sm:text-lg">
        {fact.fact_text}
      </p>
      <div className="relative z-10 mt-4 flex flex-wrap items-center gap-3">
        {fact.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-gold">{fact.category}</span>
        )}
        <span className="text-xs font-semibold text-white/70 group-hover:text-white group-hover:underline">
          Find Out More →
        </span>
      </div>
    </Link>
  );
}
