import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <div className="container-page prose prose-lg mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>Disclaimer</h1>
      <p>
        The information on {siteConfig.name} is provided in good faith, for general
        informational purposes only. {siteConfig.shortName} makes no warranty regarding the
        accuracy, adequacy, or completeness of any content, including AI-related, financial,
        or business commentary.
      </p>
      <p>
        Any action you take based on information found on this site is strictly at your own
        risk. {siteConfig.shortName} will not be liable for any losses or damages related to
        the use of this website.
      </p>
    </div>
  );
}
