import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import PlaceholderImage from "@/components/lcdkhaya/PlaceholderImage";

export const metadata: Metadata = { title: { absolute: `Gallery | ${lcdKhayaConfig.shortName}` } };

const PLACEHOLDER_SLOTS: { variant: "road" | "wheel" | "car" | "sign"; label: string }[] = [
  { variant: "car", label: "Our vehicles" },
  { variant: "wheel", label: "In the driver's seat" },
  { variant: "sign", label: "K53 test routes" },
  { variant: "road", label: "On the road" },
  { variant: "car", label: "Instructors" },
  { variant: "wheel", label: "Learners at work" }
];

export default function GalleryPage() {
  return (
    <div>
      <PageHero
        title="Gallery"
        subtitle="Real photos are coming soon — see LCDKHAYA-SETUP.md for AI image-generation prompts ready to go."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Gallery" }]}
      />
      <div className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_SLOTS.map((slot, i) => (
            <PlaceholderImage key={i} variant={slot.variant} label={slot.label} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
