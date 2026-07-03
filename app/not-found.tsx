import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true }
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy dark:text-white">Page not found</h1>
      <p className="mt-3 max-w-md text-navy/60 dark:text-white/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold/10 dark:text-white"
        >
          Browse articles
        </Link>
      </div>
    </div>
  );
}
