"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface CarouselSlide {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

const AUTOPLAY_MS = 6000;

export default function Carousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  }

  return (
    <div
      className="group relative w-full overflow-hidden bg-navy"
      style={{ height: "clamp(320px, 45vw, 400px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured stories"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.slug}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <span className="mb-3 inline-block bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {slide.category}
            </span>
            <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {slide.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/70 sm:text-base">
              {slide.description}
            </p>
            <Link
              href={`/blog/${slide.slug}`}
              className="mt-5 inline-flex items-center gap-2 bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold hover:text-white"
            >
              Read Article <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous story"
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity hover:bg-white/25 focus-visible:opacity-100 group-hover:opacity-100 sm:flex"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next story"
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity hover:bg-white/25 focus-visible:opacity-100 group-hover:opacity-100 sm:flex"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to story ${i + 1}: ${slide.title}`}
                aria-current={i === index}
                className={`h-2 transition-all ${
                  i === index ? "w-6 bg-gold" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
