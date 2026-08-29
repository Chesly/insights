/**
 * ============================================================================
 * LCD KHAYA DRIVING SCHOOL — SITE CONFIGURATION
 * ============================================================================
 * Single source of truth for the LCD Khaya micro-site that lives inside the
 * Insights codebase (reusing its CMS backend — blog, facts, newsletter,
 * checkout — under its own /lcdkhaya branding). Mirrors the pattern of
 * src/lib/siteConfig.ts, scoped to this one client.
 *
 * Pricing, branches, phone numbers and social handles below come from
 * LCD Khaya's real promotional flyer. Only the logo file, real photos and
 * testimonials remain placeholders — see LCDKHAYA-SETUP.md.
 * Edit THIS FILE ONLY to update branding, copy, packages or contact info.
 * ============================================================================
 */

export interface DrivingPackage {
  id: string;
  name: string;
  code: string;
  description: string;
  features: string[];
  /** null while a package's price is still unconfirmed — UI must render a
      "contact us" fallback rather than ever showing a fabricated price. */
  price: number | null;
  priceUnit?: string;
}

export interface Branch {
  name: string;
  addressLines: string[];
  postalCode: string;
  phone: string;
}

export const lcdKhayaConfig = {
  name: "LCD Khaya Driving School",
  shortName: "LCD Khaya",
  tagline: "Drive With Confidence. Pass With Pride.",
  description:
    "K53 driving lessons and licence training since 2014, based in Daveyton, Mayfield and Benoni, serving Gauteng's East Rand.",
  foundedYear: 2014,
  url: "https://lcdkhaya.co.za",
  locale: "en_ZA",
  language: "en-ZA",

  branding: {
    // Uploaded logo is hosted via ImageKit once Chesly adds it there —
    // placeholder path until that account/upload is set up.
    logo: "/lcdkhaya/logo-placeholder.svg",
    colors: {
      // Lifted from the LCD Khaya logo (bronze wordmark, gold crown accent)
      primary: "#B8860B", // gold
      primaryLight: "#D4AF37",
      primaryDark: "#8B6E46", // bronze
      ink: "#1A1A1A",
      cream: "#FAF6EC"
    }
  },

  contact: {
    // Main number from the flyer — doubles as the WhatsApp number.
    phone: "073 536 0733",
    whatsapp: "27735360733",
    email: "info@lcdkhaya.co.za",
    hours: "Mon–Sat, 07:00–18:00",
    primaryArea: "Daveyton, Mayfield & Benoni, Gauteng"
  },

  branches: [
    {
      name: "Daveyton",
      addressLines: ["5393 Dungeni & Bomvana Str", "Daveyton"],
      postalCode: "1520",
      phone: "081 045 5081"
    },
    {
      name: "Mayfield",
      addressLines: ["9498 Brazil & Brown Str", "Opp Mayfield Park"],
      postalCode: "1520",
      phone: "078 342 8887"
    },
    {
      name: "Chief A Luthuli Park",
      addressLines: ["2242 Harry Gwala Str", "Opp Clinic", "Benoni"],
      postalCode: "1513",
      phone: "068 533 2777"
    }
  ] as Branch[],

  social: [
    { label: "Facebook", handle: "@lcd.khayadriving", href: "https://www.facebook.com/lcd.khayadriving" },
    { label: "Instagram", handle: "@lcd.khayadrive", href: "https://www.instagram.com/lcd.khayadrive" }
  ],

  nav: [
    { label: "Home", href: "/lcdkhaya" },
    { label: "About", href: "/lcdkhaya/about" },
    { label: "Services & Packages", href: "/lcdkhaya/services" },
    { label: "Did You Know?", href: "/lcdkhaya/facts" },
    { label: "Blog", href: "/lcdkhaya/blog" },
    { label: "Gallery", href: "/lcdkhaya/gallery" },
    { label: "Contact", href: "/lcdkhaya/contact" }
  ],

  footer: {
    about:
      "LCD Khaya Driving School has offered professional K53 driving lessons and licence training since 2014, with branches in Daveyton, Mayfield and Benoni — patient instructors, flexible scheduling, and a focus on getting you road-ready with confidence.",
    legal: [
      { label: "Privacy Policy", href: "/lcdkhaya/privacy" },
      { label: "Terms of Use", href: "/lcdkhaya/terms" },
      { label: "Contact", href: "/lcdkhaya/contact" }
    ]
  },

  newsletter: {
    title: "Get Road-Ready Tips",
    description: "K53 tips, booking reminders and driving-school news for Daveyton, Mayfield & Benoni learners.",
    successMessage: "You're subscribed! Watch your inbox for tips and updates.",
    source: "lcdkhaya"
  },

  seo: {
    defaultTitle: "LCD Khaya Driving School | K53 Driving Lessons in Daveyton & Benoni",
    titleTemplate: "%s | LCD Khaya Driving School",
    defaultDescription:
      "K53 driving lessons and licence training since 2014 in Daveyton, Mayfield, Benoni and the East Rand, Gauteng. Book your driving lesson online with LCD Khaya Driving School.",
    defaultKeywords: [
      "driving school Daveyton",
      "driving school Benoni",
      "driving school Mayfield",
      "K53 lessons Gauteng",
      "learners licence Benoni",
      "code 8 driving lessons",
      "code 10 driving lessons",
      "code 14 driving lessons",
      "PrDP East Rand",
      "driving instructor East Rand"
    ]
  },

  // Blog posts and Did You Know facts are shared with the main Insights
  // content pool — these tag/category values are what filter the pool
  // down to LCD Khaya-relevant content, same pattern as /spaza-support.
  blogTag: "lcdkhaya",
  factsCategory: "Driving",

  // Real pricing from LCD Khaya's flyer. All packages include lessons and
  // tests; a 50% deposit is accepted per segment or on the full package.
  depositNote: "All packages include lessons and tests. Deposit accepted at 50% per segment or full package.",

  packages: [
    {
      id: "learners-all-codes",
      name: "Learner's Licence — All Codes",
      code: "Learner's",
      description: "K53 learner's licence theory preparation for any code, so you walk into your test ready.",
      features: ["K53 road signs & rules coaching", "Mock theory tests", "Test booking assistance"],
      price: 1600
    },
    {
      id: "code8-bundle",
      name: "Code 8 — Learner's + Licence",
      code: "Code 8",
      description: "Full package from learner's licence through to your Code 8 driving licence.",
      features: ["Learner's licence prep included", "Practical lessons", "Yard & road test included"],
      price: 6500
    },
    {
      id: "code8-licence",
      name: "Code 8 — Driving Licence Only",
      code: "Code 8",
      description: "Already have your learner's? Practical lessons and test straight through to your Code 8.",
      features: ["Practical lessons", "K53 yard & road test routes", "Test included"],
      price: 4900
    },
    {
      id: "code10-bundle",
      name: "Code 10 — Learner's + Licence",
      code: "Code 10",
      description: "Full package from learner's licence through to your Code 10 (light rigid) licence.",
      features: ["Learner's licence prep included", "Vehicle handling & yard test prep", "Road test included"],
      price: 6700
    },
    {
      id: "code10-licence",
      name: "Code 10 — Driving Licence Only",
      code: "Code 10",
      description: "Already have your learner's? Lessons and test straight through to your Code 10.",
      features: ["Vehicle handling & yard test prep", "Road test included"],
      price: 5100
    },
    {
      id: "code14-bundle",
      name: "Code 14 — Learner's + Licence",
      code: "Code 14",
      description: "Full package from learner's licence through to your Code 14 (articulated) licence.",
      features: ["Learner's licence prep included", "Articulated vehicle handling", "Road test included"],
      price: 10300
    },
    {
      id: "code14-licence",
      name: "Code 14 — Driving Licence Only",
      code: "Code 14",
      description: "Already have your learner's? Lessons and test straight through to your Code 14.",
      features: ["Articulated vehicle handling", "Road test included"],
      price: 8700
    },
    {
      id: "prdp",
      name: "PrDP",
      code: "PrDP",
      description: "Professional Driving Permit application and test preparation.",
      features: ["PrDP requirements guidance", "Test booking assistance"],
      price: 1500
    },
    {
      id: "refresher",
      name: "Refresher & Defensive Driving",
      code: "Refresher",
      description: "Already licensed but want to build confidence or brush up on defensive driving?",
      features: ["Confidence-building lessons", "Defensive driving techniques", "Highway & night driving practice"],
      price: null
    }
  ] as DrivingPackage[],

  // Left empty on purpose — real testimonials only, never fabricated ones.
  // The Testimonials component shows a "coming soon" state until this has
  // entries. Add real, permissioned reviews here once available.
  testimonials: [] as { name: string; area: string; quote: string }[],

  whyChooseUs: [
    { title: "Serving the East Rand Since 2014", text: "Over a decade of exciting, excellent service experience, preparing learners with pride." },
    { title: "K53-Focused Training", text: "Lessons and test prep built around exactly what South Africa's K53 test expects, for every code." },
    { title: "Three Local Branches", text: "Convenient branches in Daveyton, Mayfield and Benoni's Chief A Luthuli Park." },
    { title: "Flexible Packages", text: "Deposits accepted at 50% per segment or on the full package, with refresher lessons available too." }
  ]
};

export type LcdKhayaConfig = typeof lcdKhayaConfig;
