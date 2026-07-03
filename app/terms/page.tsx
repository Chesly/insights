import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="container-page prose prose-lg mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>Terms of Use</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-ZA")}</p>
      <p>
        By accessing {siteConfig.name}, you agree to these terms. Content is provided for
        informational purposes only and does not constitute professional, financial, or
        legal advice.
      </p>
      <h2>Intellectual Property</h2>
      <p>
        All content is owned by {siteConfig.owner.name} / {siteConfig.shortName} unless
        otherwise credited, and may not be reproduced without permission.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        {siteConfig.shortName} is not liable for decisions made based on content published
        on this site. Always do your own research before making business, technical, or
        financial decisions.
      </p>
      <h2>Contact</h2>
      <p>{siteConfig.owner.name} — {siteConfig.owner.email}</p>
    </div>
  );
}
