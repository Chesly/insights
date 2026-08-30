import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import PlaceholderImage from "@/components/lcdkhaya/PlaceholderImage";
import GalleryLightbox from "@/components/lcdkhaya/GalleryLightbox";

export const metadata: Metadata = { title: { absolute: `Gallery | ${lcdKhayaConfig.shortName}` } };

const PLACEHOLDER_SLOTS: { variant: "road" | "wheel" | "car" | "sign"; label: string }[] = [
  { variant: "car", label: "Our vehicles" },
  { variant: "sign", label: "K53 test routes" },
  { variant: "wheel", label: "Instructors" }
];

export default function GalleryPage() {
  return (
    <div>
      <PageHero
        title="Gallery"
        subtitle="Real graduates, real results — more photos added regularly. Click any photo to view it larger."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Gallery" }]}
      />
      <div className="container-page py-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Our Graduates</h2>
        <div className="mt-4">
          <GalleryLightbox slides={lcdKhayaConfig.galleryPhotos} />
        </div>

        <h2 className="mt-10 text-2xl font-bold text-[#1A1A1A]">More From LCD Khaya</h2>
        <p className="mt-1 text-sm text-[#1A1A1A]/50">Photos coming soon — see below for what's next.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_SLOTS.map((slot, i) => (
            <PlaceholderImage key={i} variant={slot.variant} label={slot.label} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
