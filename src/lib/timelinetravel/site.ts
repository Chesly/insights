// Timeline Travel deploys as its own Vercel project + own Supabase
// project (not a /timelinetravel subpath like lcdkhaya, which hit real
// problems with a rewrite-based custom-domain setup — see src/proxy.ts).
// Every request this deployment receives IS Timeline Travel, so a single
// build-time env flag is enough: no host-detection, no rewrite, no
// per-request branching. Root layout/page check this once and render an
// entirely separate component tree.
export const IS_TIMELINE_TRAVEL = process.env.NEXT_PUBLIC_SITE === "timelinetravel";

export const timelineTravelSiteConfig = {
  name: "Timeline Travel",
  tagline: "Travel Beyond Destinations. Create Meaningful Journeys.",
  shortDescription:
    "Connecting people, destinations, and opportunities through exceptional travel experiences.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://timelinetravel.co.za",
  logo: "/timelinetravel/brand/logo-horizontal.png",
  companyReg: "2013/085216/07",
  address: "Ground Floor, Mac Mac Building, Maxwell Office Park, Waterfall City, Johannesburg",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Tours", href: "/tours" },
    { label: "Destinations", href: "/destinations" },
    { label: "Travel Tips", href: "/travel-tips" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
