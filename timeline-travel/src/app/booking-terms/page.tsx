import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Booking Terms & Conditions" };

export default function BookingTermsPage() {
  return <LegalPage slug="booking-terms" fallbackTitle="Booking Terms & Conditions" />;
}
