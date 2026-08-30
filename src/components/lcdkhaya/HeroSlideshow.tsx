"use client";

import { useEffect, useState } from "react";
import PlaceholderImage from "./PlaceholderImage";

// Same auto-advance/dot pattern as GalleryCarousel, but for placeholder
// slides rather than real photos — kept separate since it renders
// PlaceholderImage (SVG motif + label) instead of next/image. Swap this
// back to GalleryCarousel once real hero photography is ready; the
// slot/aspect-ratio stays identical either way.
export default function HeroSlideshow({
  slides,
  autoAdvanceMs = 4500
}: {
  slides: { variant: "road" | "wheel" | "car" | "sign"; label: string }[];
  autoAdvanceMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoAdvanceMs || paused || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoAdvanceMs);
    return () => clearInterval(id);
  }, [autoAdvanceMs, paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
        {slides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}>
            <PlaceholderImage variant={slide.variant} label={slide.label} className="h-full w-full" />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-[#B8860B]" : "bg-[#B8860B]/25"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
