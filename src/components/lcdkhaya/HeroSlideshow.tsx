"use client";

import { useEffect, useState, type ReactNode } from "react";
import PlaceholderImage from "./PlaceholderImage";

// Full-bleed hero: slides fill the entire section as a background layer,
// with a dark scrim for legibility and the passed-in text content
// (heading, CTAs, etc.) overlaid on top via `children`. Swap
// PlaceholderImage for next/image once real hero photography is ready —
// the slot/aspect-ratio stays identical either way.
export default function HeroSlideshow({
  slides,
  autoAdvanceMs = 4500,
  children
}: {
  slides: { variant: "road" | "wheel" | "car" | "sign"; label: string }[];
  autoAdvanceMs?: number;
  children?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoAdvanceMs || paused || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoAdvanceMs);
    return () => clearInterval(id);
  }, [autoAdvanceMs, paused, slides.length]);

  if (slides.length === 0) return null;

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <div
      className="relative h-[440px] w-full overflow-hidden sm:h-[520px] lg:h-[620px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}>
          <PlaceholderImage variant={slide.variant} label={slide.label} showCaption={false} tone="deep" className="h-full w-full" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/85 via-[#1A1A1A]/70 to-[#1A1A1A]/55" aria-hidden="true" />

      {children && (
        <div className="relative z-10 flex h-full items-center">
          <div className="container-page">{children}</div>
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1A1A1A]/40 text-white transition-colors hover:bg-[#1A1A1A]/60 sm:left-5 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1A1A1A]/40 text-white transition-colors hover:bg-[#1A1A1A]/60 sm:right-5 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-[#D4AF37]" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
