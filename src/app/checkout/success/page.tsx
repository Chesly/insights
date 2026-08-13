"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";

interface DownloadLink {
  name: string;
  slug: string;
  downloadUrl: string;
}

type VerifyState =
  | { status: "loading" }
  | { status: "paid"; downloads: DownloadLink[] }
  | { status: "failed" }
  | { status: "error"; message: string };

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessFallback() {
  return (
    <div>
      <PageHero
        title="Order Confirmation"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Confirmation" }]}
        heightPx={140}
      />
      <div className="container-page py-16 text-center">
        <div className="mx-auto max-w-md">
          <p className="text-3xl">⏳</p>
          <h1 className="mt-4 text-xl font-bold text-navy dark:text-white">Confirming your order…</h1>
          <p className="mt-2 text-sm text-navy/60 dark:text-white/60">This only takes a moment.</p>
        </div>
      </div>
    </div>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    if (!reference) {
      setState({ status: "error", message: "No order reference was provided." });
      return;
    }
    fetch(`/api/checkout/verify?reference=${encodeURIComponent(reference)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Something went wrong.");
        if (json.status === "failed") setState({ status: "failed" });
        else setState({ status: "paid", downloads: json.downloads || [] });
      })
      .catch((err) => setState({ status: "error", message: err.message || "Something went wrong." }));
  }, [reference]);

  return (
    <div>
      <PageHero
        title="Order Confirmation"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Confirmation" }]}
        heightPx={140}
      />
      <div className="container-page py-16 text-center">
        <div className="mx-auto max-w-md">
          {state.status === "loading" && (
            <>
              <p className="text-3xl">⏳</p>
              <h1 className="mt-4 text-xl font-bold text-navy dark:text-white">Confirming your order…</h1>
              <p className="mt-2 text-sm text-navy/60 dark:text-white/60">This only takes a moment.</p>
            </>
          )}

          {state.status === "paid" && (
            <>
              <p className="text-3xl">🎉</p>
              <h1 className="mt-4 text-xl font-bold text-navy dark:text-white">Thank you — your order is complete!</h1>
              <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
                A copy of your download link{state.downloads.length > 1 ? "s" : ""} has also been emailed to you.
              </p>
              {state.downloads.length > 0 && (
                <ul className="mt-6 space-y-2 text-left">
                  {state.downloads.map((d) => (
                    <li key={d.downloadUrl} className="flex items-center justify-between gap-3 border border-gold/15 p-3">
                      <span className="truncate text-sm font-medium text-navy dark:text-white">{d.name}</span>
                      <a
                        href={d.downloadUrl}
                        className="shrink-0 bg-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gold-dark"
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/downloads" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
                ← Back to Business Toolkit
              </Link>
            </>
          )}

          {state.status === "failed" && (
            <>
              <p className="text-3xl">⚠️</p>
              <h1 className="mt-4 text-xl font-bold text-navy dark:text-white">Payment wasn&rsquo;t completed</h1>
              <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
                Your payment didn&rsquo;t go through, so nothing was charged. Please try again.
              </p>
              <Link href="/cart" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
                ← Back to Cart
              </Link>
            </>
          )}

          {state.status === "error" && (
            <>
              <p className="text-3xl">🔗</p>
              <h1 className="mt-4 text-xl font-bold text-navy dark:text-white">{state.message}</h1>
              <p className="mt-2 text-sm text-navy/60 dark:text-white/60">
                If you were charged and need help, contact us and we&rsquo;ll sort you out.
              </p>
              <Link href="/downloads" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
                ← Back to Business Toolkit
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
