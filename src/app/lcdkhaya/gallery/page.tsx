import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import GalleryLightbox from "@/components/lcdkhaya/GalleryLightbox";

export const metadata: Metadata = { title: { absolute: `Gallery | ${lcdKhayaConfig.shortName}` } };

export default function GalleryPage() {
  return (
    <div>
      <PageHero
        title="Gallery"
        subtitle="A look at LCD Khaya learners and instructors in action."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Gallery" }]}
      />
      <div className="container-page py-6">
        <GalleryLightbox slides={lcdKhayaConfig.galleryPhotos} />
      </div>
    </div>
  );
}
