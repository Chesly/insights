"use client";

import { useState } from "react";

export default function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[680/350] w-full items-center justify-center bg-gold/5 text-4xl">
        📄
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-[680/350] w-full overflow-hidden bg-gold/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={name} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`aspect-square overflow-hidden border-2 transition-colors ${
                i === active ? "border-gold" : "border-transparent hover:border-gold/40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
