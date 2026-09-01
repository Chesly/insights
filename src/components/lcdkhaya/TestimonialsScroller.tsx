import Link from "next/link";
import { getApprovedTestimonials } from "@/lib/testimonials";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

// Continuous auto-scrolling marquee — the list is duplicated so the CSS
// animation can loop seamlessly from -50% back to 0 with no visible
// jump. Pauses on hover/focus so it's actually readable, and respects
// prefers-reduced-motion (see globals via the `motion-safe:` variant).
export default async function TestimonialsScroller() {
  const testimonials = await getApprovedTestimonials("lcdkhaya");

  if (testimonials.length === 0) {
    return (
      <div className="container-page">
        <div className="border border-dashed border-[#B8860B]/30 bg-[#FAF6EC] p-8 text-center">
          <p className="text-sm text-[#1A1A1A]/60">Learner testimonials coming soon.</p>
          <Link href="/lcdkhaya/testimonials" className="mt-3 inline-block text-sm font-semibold text-[#B8860B] hover:underline">
            Be the first to share yours →
          </Link>
        </div>
      </div>
    );
  }

  const loop = [...testimonials, ...testimonials];

  return (
    <div>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max gap-6 motion-safe:animate-[lcd-marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <blockquote key={`${t.id}-${i}`} className="w-80 shrink-0 border border-[#B8860B]/20 bg-white p-6">
              {t.rating != null && (
                <div className="text-[#B8860B]" aria-hidden="true">
                  {"★".repeat(t.rating)}
                  <span className="text-[#B8860B]/20">{"★".repeat(5 - t.rating)}</span>
                </div>
              )}
              <p className="mt-2 text-sm italic text-[#1A1A1A]/80">&ldquo;{t.content}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-[#1A1A1A]">— {t.authorName}</footer>
            </blockquote>
          ))}
        </div>
      </div>
      <p className="container-page mt-6 text-center text-sm text-[#1A1A1A]/50">
        A {lcdKhayaConfig.shortName} learner?{" "}
        <Link href="/lcdkhaya/testimonials" className="font-semibold text-[#B8860B] hover:underline">
          Share your experience →
        </Link>
      </p>
    </div>
  );
}
