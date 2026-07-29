import Link from "next/link";
import PageHero from "@/components/PageHero";

const MESSAGES: Record<string, string> = {
  expired: "This download link has expired.",
  "used-up": "This download link has already been used the maximum number of times.",
  invalid: "This download link isn't valid.",
};

export default async function DownloadExpiredPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message = MESSAGES[reason || "invalid"] || MESSAGES.invalid;

  return (
    <div>
      <PageHero title="Download Link" breadcrumbs={[{ label: "Home", href: "/" }]} heightPx={140} />
      <div className="container-page py-16 text-center">
        <div className="mx-auto max-w-md">
          <p className="text-3xl">🔗</p>
          <h1 className="mt-4 text-xl font-bold text-navy dark:text-white">{message}</h1>
          <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
            If you paid for this download and need it again, contact us and we&rsquo;ll sort you out — or
            browse the toolkit below.
          </p>
          <Link href="/downloads" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
            ← Back to Business Toolkit
          </Link>
        </div>
      </div>
    </div>
  );
}
