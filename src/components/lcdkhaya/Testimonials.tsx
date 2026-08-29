import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

// No fabricated reviews here — the list starts empty in config.ts until
// LCD Khaya has real, permissioned testimonials to add.
export default function Testimonials() {
  if (lcdKhayaConfig.testimonials.length === 0) {
    return (
      <div className="border border-dashed border-[#B8860B]/30 bg-[#FAF6EC] p-8 text-center text-sm text-[#1A1A1A]/60">
        Learner testimonials coming soon.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {lcdKhayaConfig.testimonials.map((t) => (
        <blockquote key={t.name} className="border border-[#B8860B]/20 bg-white p-6">
          <p className="text-sm italic text-[#1A1A1A]/80">&ldquo;{t.quote}&rdquo;</p>
          <footer className="mt-4 text-sm font-semibold text-[#1A1A1A]">
            — {t.name}, <span className="font-normal text-[#1A1A1A]/60">{t.area}</span>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
