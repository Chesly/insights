"use client";

import Link from "next/link";
import { EV, track } from "@/lib/meta-events";

// Wraps a plain <a>/<Link> so a click on a toolkit upsell fires the
// ToolkitCtaClick custom event before navigating — used on pages (server
// components) that can't hold an onClick handler themselves. See
// lib/meta-events.ts; no-ops until the visitor has accepted the cookie
// banner, same as every other Meta event on the site.
export default function TrackedCtaLink({
  href,
  placement,
  className,
  children,
}: {
  href: string;
  placement: "inline" | "sidebar" | "footer";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        void track(EV.TOOLKIT_CTA_CLICK, { params: { placement } });
      }}
    >
      {children}
    </Link>
  );
}
