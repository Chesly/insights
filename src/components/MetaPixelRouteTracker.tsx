"use client";

// Next.js App Router is a SPA after first load, so the Pixel's automatic
// PageView (fired once, from ConsentManager, at the moment consent is
// granted) never sees any page after that. This re-fires it on every route
// change — without it, every page after the one where consent was granted
// is invisible to Meta.
//
// Always mounted (unlike the pixel script itself, which only exists once
// ConsentManager injects it): track() below checks the same consent flag
// and no-ops until then, so this is inert for a visitor who hasn't opted in.

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { captureAttribution, track } from "@/lib/meta-events";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRun = useRef(true);

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    // Skip the mount-time run — ConsentManager's init script already fires
    // the first PageView the moment consent is granted.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    void track("PageView");
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixelRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
