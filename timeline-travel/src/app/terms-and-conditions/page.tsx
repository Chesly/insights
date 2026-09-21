import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsAndConditionsPage() {
  return <LegalPage slug="terms-and-conditions" fallbackTitle="Terms & Conditions" />;
}
