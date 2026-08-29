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
  /** The official SA driving-licence code (A, B, C1, EC) shown on the
      licence card itself — distinct from `code`, which is the school's
      everyday "Code 8/10/14" shorthand customers actually search for. */
  licenceCode?: string;
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

export interface DayHours {
  label: string;
  hours: string;
}

export const lcdKhayaConfig = {
  name: "LCD Khaya Driving School",
  shortName: "LCD Khaya",
  tagline: "We Unpack and Simplify Driving For You.",
  description:
    "Learner's licence, driving licence and PrDP training since 2014, based in Daveyton, Mayfield and Benoni, serving Ekurhuleni and Gauteng's East Rand.",
  // Longer-form About copy, in LCD Khaya's own words.
  aboutCopy: [
    "The Driving School that needs no introduction, as its reputation precedes it. With beyond a decade of experience and a spirit of excellence, we've made learning to drive easier and more exciting over the years.",
    "It worked for many, it can work for you! Come experience and achieve — it begins with us."
  ],
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
    primaryArea: "Ekurhuleni: Daveyton, Mayfield & Benoni, Gauteng"
  },

  // Office hours (admin/reception) differ from lesson-availability days —
  // lessons also run Saturdays and alternate Sundays even though the
  // office itself is closed on Sunday.
  officeHours: [
    { label: "Monday – Friday", hours: "08:00 – 17:00" },
    { label: "Saturday", hours: "08:00 – 14:00" },
    { label: "Sunday", hours: "Closed" },
    { label: "Public Holidays", hours: "08:00 – 13:00" }
  ] as DayHours[],
  lessonScheduleNote: "Lessons run during normal office working days and hours, plus every Saturday and alternate Sundays.",

  branches: [
    {
      name: "Daveyton",
      addressLines: ["5393 Dungeni & Bomvana Street", "Daveyton"],
      postalCode: "1520",
      phone: "081 045 5081"
    },
    {
      name: "Mayfield",
      addressLines: ["9498 Brazil and Brown Street", "Mayfield Ext 4, Daveyton", "Next to Mayfield Park"],
      postalCode: "1529",
      phone: "078 342 8887"
    },
    {
      name: "Chief A Luthuli Park",
      addressLines: ["2242 Harry Gwala Street", "Opposite Clinic", "Benoni"],
      postalCode: "1513",
      phone: "068 533 2777"
    }
  ] as Branch[],

  social: [
    { label: "Facebook", handle: "@lcd.khayadriving", href: "https://www.facebook.com/lcd.khayadriving" },
    { label: "Instagram", handle: "@lcd.khayadrive", href: "https://www.instagram.com/lcd.khayadrive" },
    { label: "TikTok", handle: "@lcd.khayadrive", href: "https://www.tiktok.com/@lcd.khayadrive" }
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
      "The driving school that needs no introduction. Since 2014, LCD Khaya has specialised in learner's licence, driving licence and PrDP training across Daveyton, Mayfield and Benoni — we unpack and simplify driving for you.",
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
      "motorcycle licence East Rand",
      "PrDP goods and passengers",
      "driving instructor East Rand",
      "Ekurhuleni driving school"
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
      description: "K53 learner's licence theory preparation for Code 1 (motorcycle), Code 2 (light vehicle) and Code 3 (heavy & articulated vehicle), so you walk into your test ready.",
      features: ["K53 road signs & rules coaching", "Mock theory tests", "Test booking assistance"],
      price: 1600
    },
    {
      id: "motorcycle",
      name: "Motorcycle",
      code: "Code 1",
      licenceCode: "A",
      description: "Learner's and driving licence lessons for motorcycles.",
      features: ["Learner's licence prep included", "Practical riding lessons", "Test booking assistance"],
      price: null
    },
    {
      id: "code8-bundle",
      name: "Code 8 — Learner's + Licence",
      code: "Code 8",
      licenceCode: "B",
      description: "Full package from learner's licence through to your Code 8 (light vehicle) driving licence.",
      features: ["Learner's licence prep included", "Practical lessons", "Yard & road test included"],
      price: 6500
    },
    {
      id: "code8-licence",
      name: "Code 8 — Driving Licence Only",
      code: "Code 8",
      licenceCode: "B",
      description: "Already have your learner's? Practical lessons and test straight through to your Code 8.",
      features: ["Practical lessons", "K53 yard & road test routes", "Test included"],
      price: 4900
    },
    {
      id: "code10-bundle",
      name: "Code 10 — Learner's + Licence",
      code: "Code 10",
      licenceCode: "C1",
      description: "Full package from learner's licence through to your Code 10 (heavy vehicle) licence.",
      features: ["Learner's licence prep included", "Vehicle handling & yard test prep", "Road test included"],
      price: 6700
    },
    {
      id: "code10-licence",
      name: "Code 10 — Driving Licence Only",
      code: "Code 10",
      licenceCode: "C1",
      description: "Already have your learner's? Lessons and test straight through to your Code 10.",
      features: ["Vehicle handling & yard test prep", "Road test included"],
      price: 5100
    },
    {
      id: "code14-bundle",
      name: "Code 14 — Learner's + Licence",
      code: "Code 14",
      licenceCode: "EC",
      description: "Full package from learner's licence through to your Code 14 (articulated vehicle) licence.",
      features: ["Learner's licence prep included", "Articulated vehicle handling", "Road test included"],
      price: 10300
    },
    {
      id: "code14-licence",
      name: "Code 14 — Driving Licence Only",
      code: "Code 14",
      licenceCode: "EC",
      description: "Already have your learner's? Lessons and test straight through to your Code 14.",
      features: ["Articulated vehicle handling", "Road test included"],
      price: 8700
    },
    {
      id: "prdp",
      name: "PrDP",
      code: "PrDP",
      description: "Professional Driving Permit application and test preparation, for both Goods and Passengers categories.",
      features: ["Goods & Passengers PrDP guidance", "Requirements assistance", "Test booking assistance"],
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

  whyChooseUs: [
    { title: "Beyond a Decade of Experience", text: "Serving Ekurhuleni since 2014 with a spirit of excellence — it worked for many, it can work for you." },
    { title: "Every Licence Category", text: "Motorcycle, light vehicle, heavy vehicle, articulated vehicle and PrDP — all under one roof." },
    { title: "Three Local Branches", text: "Convenient branches in Daveyton, Mayfield and Benoni's Chief A Luthuli Park." },
    { title: "We Handle the Details", text: "Online booking and assistance with your necessary requirements, so you can focus on learning to drive." }
  ],

  // Real graduate photos (ID/licence card details blurred out before
  // publishing — see LCDKHAYA-SETUP.md). More arrive in batches, so this
  // is just a flat list to extend rather than a full media-library module.
  galleryPhotos: [
    { src: "/lcdkhaya/gallery/graduate-1.jpg", alt: "LCD Khaya graduate holding their driving licence in front of the branded truck" },
    { src: "/lcdkhaya/gallery/graduate-2.jpg", alt: "LCD Khaya graduate holding their driving licence in front of the branded truck" },
    { src: "/lcdkhaya/gallery/graduate-3.jpg", alt: "LCD Khaya graduate holding their driving licence in front of the branded truck" },
    { src: "/lcdkhaya/gallery/graduate-4.jpg", alt: "LCD Khaya graduate holding their driving licence in front of the branded truck" },
    { src: "/lcdkhaya/gallery/graduate-5.jpg", alt: "LCD Khaya graduate holding their driving licence in front of the branded truck" },
    { src: "/lcdkhaya/gallery/graduate-6.jpg", alt: "LCD Khaya graduate holding their driving licence in front of the branded truck" }
  ],

  // Copy for the lightweight "request a callback" lead form — for
  // visitors who'd rather have LCD Khaya call them than fill out a full
  // booking or contact form.
  callback: {
    title: "Not Sure Where to Start?",
    description: "Submit your details and we'll call you to answer your questions and get you ready to proceed.",
    successMessage: "Thanks! We've got your details and will call you shortly."
  }
};

export type LcdKhayaConfig = typeof lcdKhayaConfig;
