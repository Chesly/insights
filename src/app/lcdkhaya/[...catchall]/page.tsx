import { notFound } from "next/navigation";

// Any path under /lcdkhaya/* that doesn't match a real page lands here.
// Without this catch-all, Next.js can't match the URL to anything inside
// the /lcdkhaya route segment at all, so it falls all the way back to the
// site-wide not-found.tsx — showing the main Chesly.Tech Insights site's
// branding on what's supposed to be a fully white-labeled client site.
// Matching here first means notFound() correctly bubbles up to the
// nested lcdkhaya/not-found.tsx instead.
export default function LcdKhayaCatchAll() {
  notFound();
}
