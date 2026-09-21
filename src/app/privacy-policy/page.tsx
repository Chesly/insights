import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { TimelineTravelLegalPage } from "../timelinetravel-legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  if (!IS_TIMELINE_TRAVEL) notFound();
  return <TimelineTravelLegalPage slug="privacy-policy" fallbackTitle="Privacy Policy" />;
}
