import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { TimelineTravelLegalPage } from "../timelinetravel-legal";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsAndConditionsPage() {
  if (!IS_TIMELINE_TRAVEL) notFound();
  return <TimelineTravelLegalPage slug="terms-and-conditions" fallbackTitle="Terms & Conditions" />;
}
