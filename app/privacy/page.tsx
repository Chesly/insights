import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-page prose prose-lg mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-ZA")}</p>
      <p>
        {siteConfig.name} ("we", "us") respects your privacy. This policy explains what
        information we collect and how we use it.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Contact details you submit voluntarily (name, email, message).</li>
        <li>Newsletter sign-up email addresses.</li>
        <li>Standard analytics data (pages visited, device type, approximate location).</li>
      </ul>
      <h2>How We Use Information</h2>
      <p>
        We use collected information to respond to enquiries, send newsletters you've
        subscribed to, and improve site content and performance.
      </p>
      <h2>Third-Party Services</h2>
      <p>
        We may use Google Analytics, Google Search Console, Microsoft Clarity, and similar
        tools to understand site usage. These services may set cookies in your browser.
      </p>
      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by
        emailing <a href={`mailto:${siteConfig.owner.email}`}>{siteConfig.owner.email}</a>.
      </p>
      <h2>Contact</h2>
      <p>{siteConfig.owner.name} — {siteConfig.owner.email}</p>
    </div>
  );
}
