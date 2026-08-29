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
      <div className="container-page py-14">
        <Suspense fallback={null}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
