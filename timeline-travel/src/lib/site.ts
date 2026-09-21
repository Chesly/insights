export const siteConfig = {
  name: "Timeline Travel",
  tagline: "Travel Beyond Destinations. Create Meaningful Journeys.",
  shortDescription:
    "Connecting people, destinations, and opportunities through exceptional travel experiences.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://timelinetravel.co.za",
  logo: "/brand/logo-horizontal.png",
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
