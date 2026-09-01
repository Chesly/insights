import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import BookingForm from "@/components/lcdkhaya/BookingForm";

export const metadata: Metadata = { title: { absolute: `Book a Lesson | ${lcdKhayaConfig.shortName}` } };

export default function BookingPage() {
  return (
    <div>
      <PageHero
        title="Book a Lesson"
        subtitle="Pick your package and tell us a bit about you — we'll take it from there."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Book a Lesson" }]}
      />
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
        <div className="relative hidden min-h-[320px] w-full overflow-hidden lg:block">
          <Image
            src={lcdKhayaConfig.bookingImage}
            alt="Preparing to get a driver's licence"
            fill
            sizes="35vw"
            className="object-cover"
          />
        </div>
        <Suspense fallback={null}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
