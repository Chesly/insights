"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CarouselSlide } from "./GalleryCarousel";

// Click a thumbnail → the same photo opens large in an overlay, with
// next/prev to page through the rest without closing. This is distinct
// from GalleryCarousel (the auto-advancing hero slideshow) — a gallery
// page is browsed, a hero is watched.
export default function GalleryLightbox({ slides }: { slides: CarouselSlide[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % slides.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + slides.length) % slides.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, slides.length]);

  if (slides.length === 0) return null;
  const active = openIndex !== null ? slides[openIndex] : null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/3] w-full overflow-hidden bg-[#1A1A1A]"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i === null ? i : (i - 1 + slides.length) % slides.length)); }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/80 hover:text-white sm:left-6"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={active.src} alt={active.alt} fill sizes="90vw" className="object-contain" />
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i === null ? i : (i + 1) % slides.length)); }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/80 hover:text-white sm:right-6"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">
            {openIndex! + 1} / {slides.length}
          </p>
        </div>
      )}
    </>
  );
}
