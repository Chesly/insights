/**
 * ============================================================================
 * GLOBAL SITE CONFIGURATION
 * ============================================================================
 * Single source of truth for every piece of static site data — branding,
 * contact info, social links, navigation, footer content, newsletter copy,
 * SEO defaults, and taxonomy. Every component/page in this project should
 * read from here rather than hardcoding values.
 *
 * To rebrand, change contact details, add a social platform, edit navigation,
 * or update footer content: edit THIS FILE ONLY. Nothing else should need
 * to change.
 * ============================================================================
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Key used to look up the matching icon in components/SocialLinks.tsx */
  icon: "facebook" | "instagram" | "linkedin" | "youtube" | "pinterest" | "tiktok" | "website";
}

export const siteConfig = {
  // ── Website Information ────────────────────────────────────────────────
  name: "Chesly.Tech Insights",
  shortName: "Chesly.Tech",
  tagline: "AI, Technology & SEO Insights",
  description:
    "AI startups, technology, SEO and digital marketing insights with a South African perspective.",
  companyName: "Chesly.Tech",
  copyright: `© ${new Date().getFullYear()} Chesly.Tech. All Rights Reserved.`,
  url: "https://chesly.tech/insights",
  locale: "en_ZA",
  language: "en-ZA",

  // ── Branding ────────────────────────────────────────────────────────────
  branding: {
    logo: "https://chesly.tech/insights/images/chesly.tech_logo.png",
    /** Used on dark surfaces — header and footer */
    logoWhite: "https://chesly.tech/insights/images/chesly.tech_logo_white.png",
    favicon: "https://chesly.tech/insights/images/favco.png",
    colors: {
      primary: "#8B6914", // gold
      primaryLight: "#B8935A",
      primaryDark: "#5C4510",
      secondary: "#1B2A4A", // navy
      secondaryLight: "#2E4270",
      secondaryDark: "#0F1A30",
      accent: "#00D4FF"
    }
  },

  // ── Contact Information ─────────────────────────────────────────────────
  contact: {
    email: "hello@chesly.tech",
    phone: "+27 81 586 8101",
    whatsapp: "+27815868101",
    location: "Johannesburg, South Africa",
    hours: "Mon–Fri, 09:00–17:00 SAST"
  },

  // ── Social Media Links ───────────────────────────────────────────────────
  // Every social icon across the site (header, footer, author pages, schema
  // sameAs) reads from this list — add/remove a platform here only.
  social: [
    { label: "Website", href: "https://chesly.tech/", icon: "website" },
    { label: "Facebook", href: "https://www.facebook.com/Chesly.Tech/", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/chesly.tech/", icon: "instagram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/cheslytech/", icon: "linkedin" },
    { label: "YouTube", href: "https://www.youtube.com/@CheslyTech", icon: "youtube" },
    { label: "Pinterest", href: "https://za.pinterest.com/CheslyTech/", icon: "pinterest" },
    { label: "TikTok", href: "https://www.tiktok.com/@chesly.tech", icon: "tiktok" }
  ] satisfies SocialLink[],

  owner: {
    name: "Chesly Silaule",
    email: "hello@chesly.tech",
    role: "Owner, Designed and Developed by",
    url: "https://chesly.tech"
  },

  // ── Navigation ───────────────────────────────────────────────────────────
  nav: [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/blog" },
    { label: "Categories", href: "/category" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ] satisfies NavLink[],

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    about:
      "Chesly.Tech is a Johannesburg-based creative studio and AI-first technology publication helping South African businesses build a modern digital presence. We cover AI, startups, SEO/GEO, and digital marketing — and design and build the websites, brands, and content that put businesses on the map.",
    ctaButton: { label: "Visit Chesly.Tech", href: "https://chesly.tech/" },
    services: [
      { label: "Website Design", href: "https://chesly.tech/#services" },
      { label: "Graphic Design", href: "https://chesly.tech/#services" },
      { label: "SEO", href: "https://chesly.tech/#services" },
      { label: "AI Solutions", href: "https://chesly.tech/#services" },
      { label: "Digital Marketing", href: "https://chesly.tech/#services" },
      { label: "Brand Strategy", href: "https://chesly.tech/#services" }
    ] satisfies FooterLink[],
    resources: [
      { label: "Articles", href: "/blog" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Contact", href: "/contact" }
    ] satisfies FooterLink[],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" }
    ] satisfies FooterLink[]
  },

  // ── Newsletter ───────────────────────────────────────────────────────────
  newsletter: {
    title: "Get the newsletter",
    description: "Weekly AI, SEO and South African tech insights — straight to your inbox.",
    fields: {
      name: { label: "Full Name", placeholder: "Jane Dlamini" },
      email: { label: "Email Address", placeholder: "you@email.com" },
      phone: { label: "Mobile Number", placeholder: "081 234 5678" },
      business: { label: "Business / Position", placeholder: "Founder, Acme Co." }
    },
    submitLabel: "Subscribe",
    successMessage: "You're in! Check your inbox to confirm your subscription."
  },

  // ── SEO Defaults ─────────────────────────────────────────────────────────
  seo: {
    defaultTitle: "Chesly.Tech Insights | AI, Tech & SEO Insights from South Africa",
    titleTemplate: "%s | Chesly.Tech Insights",
    defaultDescription:
      "AI, startups, technology, SEO, GEO, and digital marketing insights with a South Africa-first perspective — from Chesly.Tech.",
    defaultKeywords: [
      "AI South Africa",
      "technology news South Africa",
      "SEO South Africa",
      "GEO generative engine optimization",
      "startup news",
      "digital marketing insights"
    ],
    twitterHandle: "@CheslyTech",
    defaultOgImage: "/opengraph-image"
  },

  // ── Categories & Tags ────────────────────────────────────────────────────
  categories: [
    "AI",
    "Technology",
    "Programming",
    "Business",
    "Startups",
    "Cloud",
    "Cybersecurity",
    "SEO",
    "Marketing",
    "Productivity",
    "Reviews",
    "Tutorials",
    "South Africa",
    "Finance"
  ],
  /** Curated subset shown as the slim category row on the homepage hero */
  topCategories: ["AI", "Technology", "SEO", "Startups", "Digital Marketing"],
  featuredTags: [
    "AI",
    "SEO",
    "GEO",
    "South Africa",
    "Startups",
    "Web Design",
    "Digital Marketing"
  ]
};

export type SiteConfig = typeof siteConfig;
