import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { TimelineTravelLegalPage } from "../timelinetravel-legal";

export const metadata: Metadata = { title: "Booking Terms & Conditions" };

export default function BookingTermsPage() {
  if (!IS_TIMELINE_TRAVEL) notFound();
  return <TimelineTravelLegalPage slug="booking-terms" fallbackTitle="Booking Terms & Conditions" />;
}
