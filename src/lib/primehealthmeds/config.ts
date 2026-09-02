/**
 * ============================================================================
 * PRIME HEALTH MEDS — SITE CONFIGURATION
 * ============================================================================
 * Single source of truth for the Prime Health Meds pharmacy micro-site that
 * lives inside the Insights codebase, reusing its CMS backend — the new
 * Products/Categories e-commerce module, checkout, orders, invoicing, blog
 * and FAQ — under its own /primehealthmeds branding. Mirrors the pattern of
 * src/lib/lcdkhaya/config.ts, scoped to this one client.
 *
 * EVERYTHING below (branding colours, contact details, FAQs, copy) is a
 * PLACEHOLDER pending Prime Health Meds' real branding and content — this
 * environment could not reach primehealthmeds.co.za to pull real data (see
 * PRIMEHEALTHMEDS-SETUP.md). Edit THIS FILE ONLY to update branding/copy;
 * edit real product data via /admin/products and /admin/categories
 * (catalog: "Prime Health Meds").
 * ============================================================================
 */

export const primeHealthMedsConfig = {
  name: "Prime Health Meds",
  shortName: "Prime Health Meds",
  tagline: "Your trusted online pharmacy.",
  description:
    "PLACEHOLDER — replace with real positioning copy. An online pharmacy offering everyday medicines, vitamins & supplements, and personal care products.",
  url: "https://primehealthmeds.co.za",
  locale: "en_ZA",
  language: "en-ZA",

  branding: {
    // No real logo/photos available yet — swap these once Prime Health
    // Meds provides brand assets. Colours below are a neutral placeholder
    // healthcare palette (teal/green), not the real brand.
    logoHorizontal: "",
    favicon: "https://ik.imagekit.io/mkvu8hdr5/insights/Chesly-Tech-Gol-Logo.png",
    colors: {
      primary: "#0f766e", // teal
      primaryLight: "#14b8a6",
      primaryDark: "#0d5f59",
      ink: "#111827",
      cream: "#F7FAF9"
    }
  },

  contact: {
    phone: "PLACEHOLDER — add real number",
    whatsapp: "",
    email: "info@primehealthmeds.co.za",
    address: "PLACEHOLDER — add real address"
  },

  social: [] as { label: string; handle: string; href: string }[],

  nav: [
    { label: "Home", href: "/primehealthmeds" },
    { label: "Shop", href: "/primehealthmeds/shop" },
    { label: "Blog", href: "/primehealthmeds/blog" },
    { label: "FAQ", href: "/primehealthmeds/faq" },
    { label: "About", href: "/primehealthmeds/about" },
    { label: "Contact", href: "/primehealthmeds/contact" }
  ],

  footer: {
    about:
      "PLACEHOLDER — replace with real About copy. Prime Health Meds is an online pharmacy built to make everyday medicines and health products easy to find and order.",
    legal: [
      { label: "Privacy Policy", href: "/primehealthmeds/privacy" },
      { label: "Terms of Use", href: "/primehealthmeds/terms" },
      { label: "Contact", href: "/primehealthmeds/contact" }
    ]
  },

  seo: {
    defaultTitle: "Prime Health Meds | Online Pharmacy",
    titleTemplate: "%s | Prime Health Meds",
    defaultDescription:
      "PLACEHOLDER — replace with real SEO description. Shop medicines, vitamins, supplements and personal care products online from Prime Health Meds.",
    defaultKeywords: ["online pharmacy South Africa", "buy medicine online", "vitamins and supplements"]
  },

  // Blog posts are shared with the main Insights content pool — tag posts
  // "primehealthmeds" in the Insights admin and they surface here, same
  // pattern as LCD Khaya's blogTag.
  blogTag: "primehealthmeds",

  // Which Products/Categories catalog this storefront reads — see
  // /admin/products and /admin/categories, both scoped by this `site` slug.
  catalogSite: "primehealthmeds",

  // PLACEHOLDER FAQs — replace with Prime Health Meds' real policies
  // (delivery, prescriptions, returns) via editing this array.
  faqs: [
    {
      question: "Do I need a prescription to order?",
      answer:
        "PLACEHOLDER — replace with the real policy. Some products are marked \"requires prescription\" and need a valid prescription uploaded or provided before dispatch."
    },
    {
      question: "How long does delivery take?",
      answer: "PLACEHOLDER — replace with real delivery timelines and areas covered."
    },
    {
      question: "What payment methods are accepted?",
      answer: "PLACEHOLDER — replace with real payment methods (this site currently checks out via Paystack)."
    },
    {
      question: "Can I return a product?",
      answer: "PLACEHOLDER — replace with the real returns/refunds policy."
    }
  ]
};
