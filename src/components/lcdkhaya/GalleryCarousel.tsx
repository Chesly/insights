"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
}

export default function GalleryCarousel({
  slides,
  autoAdvanceMs = 5000
}: {
  slides: CarouselSlide[];
  /** Set to 0 to disable auto-advance. */
  autoAdvanceMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (!autoAdvanceMs || paused || slides.length <= 1) return;
    const id = setInterval(next, autoAdvanceMs);
    return () => clearInterval(id);
  }, [autoAdvanceMs, paused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1A1A1A] sm:aspect-[16/10]">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 640px) 700px, 100vw"
              className="object-cover sm:object-contain"
              priority={i === 0}
            />
            {slide.caption && (
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm text-white">
                {slide.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-3 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-[#B8860B]" : "bg-[#B8860B]/25"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
