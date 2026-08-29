/**
 * ============================================================================
 * LCD KHAYA DRIVING SCHOOL — SITE CONFIGURATION
 * ============================================================================
 * Single source of truth for the LCD Khaya micro-site that lives inside the
 * Insights codebase (reusing its CMS backend — blog, facts, newsletter,
 * checkout — under its own /lcdkhaya branding). Mirrors the pattern of
 * src/lib/siteConfig.ts, scoped to this one client.
 *
 * Everything marked TBD/placeholder below is intentional: real pricing,
 * contact details, photography and social links haven't been supplied yet.
 * Edit THIS FILE ONLY to update branding, copy, packages or contact info.
 * ============================================================================
 */

export interface DrivingPackage {
  id: string;
  name: string;
  code: string;
  description: string;
  features: string[];
  /** null until Chesly supplies real pricing — UI must render a
      "contact us" fallback rather than ever showing a fabricated price. */
  price: number | null;
  priceUnit?: string;
}

export const lcdKhayaConfig = {
  name: "LCD Khaya Driving School",
  shortName: "LCD Khaya",
  tagline: "Drive With Confidence. Pass With Pride.",
  description:
    "Professional, patient K53 driving lessons and licence training based in Daveyton and Benoni, serving Gauteng's East Rand.",
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
    // TBD — Chesly to confirm real number/email before launch.
    phone: "+27 00 000 0000",
    whatsapp: "27000000000",
    email: "info@lcdkhaya.co.za",
    hours: "Mon–Sat, 07:00–18:00",
    primaryArea: "Daveyton & Benoni, Gauteng",
    serviceAreas: ["Daveyton", "Benoni", "Etwatwa", "Actonville", "Northmead", "Wattville"]
  },

  // Left empty on purpose — do not invent handles. Fill in once Chesly
  // has real social profiles for the school.
  social: [] as { label: string; href: string }[],

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
      "LCD Khaya Driving School offers professional K53 driving lessons and licence training in Daveyton, Benoni and the surrounding East Rand — patient instructors, flexible scheduling, and a focus on getting you road-ready with confidence.",
    legal: [
      { label: "Privacy Policy", href: "/lcdkhaya/privacy" },
      { label: "Terms of Use", href: "/lcdkhaya/terms" },
      { label: "Contact", href: "/lcdkhaya/contact" }
    ]
  },

  newsletter: {
    title: "Get Road-Ready Tips",
    description: "K53 tips, booking reminders and driving-school news for Daveyton & Benoni learners.",
    successMessage: "You're subscribed! Watch your inbox for tips and updates.",
    source: "lcdkhaya"
  },

  seo: {
    defaultTitle: "LCD Khaya Driving School | K53 Driving Lessons in Daveyton & Benoni",
    titleTemplate: "%s | LCD Khaya Driving School",
    defaultDescription:
      "K53 driving lessons and licence training in Daveyton, Benoni and the East Rand, Gauteng. Book your driving lesson online with LCD Khaya Driving School.",
    defaultKeywords: [
      "driving school Daveyton",
      "driving school Benoni",
      "K53 lessons Gauteng",
      "learners licence Benoni",
      "code 8 driving lessons",
      "driving instructor East Rand"
    ]
  },

  // Blog posts and Did You Know facts are shared with the main Insights
  // content pool — these tag/category values are what filter the pool
  // down to LCD Khaya-relevant content, same pattern as /spaza-support.
  blogTag: "lcdkhaya",
  factsCategory: "Driving",

  packages: [
    {
      id: "learners",
      name: "Learner's Licence (Code 8)",
      code: "Code 8",
      description: "K53 learner's licence theory preparation, so you walk into your test ready.",
      features: ["K53 road signs & rules coaching", "Mock theory tests", "Test booking assistance"],
      price: null
    },
    {
      id: "code8",
      name: "Driving Lessons — Light Motor Vehicle",
      code: "Code 8",
      description: "Practical driving lessons for cars, from your first lesson through to test-ready.",
      features: ["Beginner to advanced lessons", "K53 yard & road test routes", "Flexible lesson packages"],
      price: null
    },
    {
      id: "code10",
      name: "Driving Lessons — Code 10",
      code: "Code 10",
      description: "Light rigid / heavy vehicle lessons for drivers moving up from a Code 8.",
      features: ["Vehicle handling & yard test prep", "Road test preparation"],
      price: null
    },
    {
      id: "code14",
      name: "Driving Lessons — Code 14",
      code: "Code 14",
      description: "Heavy and articulated vehicle training for professional driving careers.",
      features: ["Articulated vehicle handling", "Professional driving permit (PrDP) guidance"],
      price: null
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
    { title: "Patient, Professional Instructors", text: "Learn at a pace that works for you, with instructors focused on building real confidence behind the wheel." },
    { title: "K53-Focused Training", text: "Lessons and test prep built around exactly what South Africa's K53 test expects." },
    { title: "Local to Daveyton & Benoni", text: "Test routes and yard practice based on your local test centres and roads." },
    { title: "Flexible Scheduling", text: "Lessons that fit around work, school and family commitments." }
  ]
};

export type LcdKhayaConfig = typeof lcdKhayaConfig;
