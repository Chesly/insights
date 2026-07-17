/**
 * ============================================================================
 * GLOBAL SITE CONFIGURATION
 * ============================================================================
 * Single source of truth for every piece of static site data — branding,
 * contact info, social links, navigation, footer content, newsletter copy,
 * SEO defaults, taxonomy, page intros, and section colours. Every
 * component/page in this project should read from here rather than
 * hardcoding values.
 *
 * To rebrand, change contact details, add a social platform, edit
 * navigation, or update footer/page content: edit THIS FILE ONLY.
 * ============================================================================
 */

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  /** Key used to look up the matching icon in components/SocialLinks.tsx */
  icon: "facebook" | "instagram" | "linkedin" | "youtube" | "pinterest" | "tiktok";
}

export interface DownloadItem {
  title: string;
  description: string;
  format: string;
  status: "Coming Soon" | "Available";
}

export const siteConfig = {
  // ── Website Information ────────────────────────────────────────────────
  name: "Chesly.Tech Insights",
  shortName: "Chesly.Tech",
  heroKicker: "Chesly.Tech Insights",
  tagline: "AI, Technology & SEO Insights",
  topCategoryLine: "AI • Technology • SEO • Startups • Digital Marketing",
  description:
    "AI startups, technology, SEO and digital marketing insights with a South African perspective.",
  companyName: "Chesly.Tech",
  copyright: `© ${new Date().getFullYear()} Chesly.Tech. All Rights Reserved.`,
  url: "https://chesly.tech/insights",
  locale: "en_ZA",
  language: "en-ZA",

  // ── Branding ────────────────────────────────────────────────────────────
  branding: {
    /** Header logo — shown on the dark sticky header */
    logoHeader: "https://ik.imagekit.io/mkvu8hdr5/insights/Chesly-Tech-Gol-Logo.png",
    /** Footer logo — shown on the dark footer */
    logoFooter: "https://chesly.tech/images/insights_footer_logo.png",
    favicon: "https://ik.imagekit.io/mkvu8hdr5/insights/CT-Favco.png",
    colors: {
      primary: "#8B6914", // gold
      primaryLight: "#B8935A",
      primaryDark: "#5C4510",
      secondary: "#1B2A4A", // navy (legacy accents, e.g. schema/tailwind fallback)
      accent: "#00D4FF",
      // v2 refinement palette
      utilityBarBg: "#13161d",
      utilityBarText: "#FFFFFF",
      sectionBg: "#2e333d",
      footerBg: "#1a1c21",
      footerCopyrightBg: "#030303",
      // v3 polish pass
      activeMenu: "#553901",
      categoriesStripBg: "#abb6ce"
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
  // Every social icon across the site (utility bar, footer, author pages,
  // schema sameAs) reads from this list — add/remove a platform here only.
  social: [
    { label: "Facebook", handle: "@chesly.tech", href: "https://www.facebook.com/Chesly.Tech/", icon: "facebook" },
    { label: "Instagram", handle: "@chesly.tech", href: "https://www.instagram.com/chesly.tech/", icon: "instagram" },
    { label: "LinkedIn", handle: "Chesly.Tech", href: "https://www.linkedin.com/in/cheslytech/", icon: "linkedin" },
    { label: "Pinterest", handle: "@CheslyTech", href: "https://za.pinterest.com/CheslyTech/", icon: "pinterest" },
    { label: "YouTube", handle: "@CheslyTech", href: "https://www.youtube.com/@CheslyTech", icon: "youtube" },
    { label: "TikTok", handle: "@chesly.tech", href: "https://www.tiktok.com/@chesly.tech", icon: "tiktok" }
  ] satisfies SocialLink[],

  owner: {
    name: "Chesly Silaule",
    email: "hello@chesly.tech",
    role: "Owner, Designed and Developed by",
    url: "https://chesly.tech"
  },

  // ── Navigation ───────────────────────────────────────────────────────────
  // Room is intentionally left for future pages — just add another entry.
  nav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Insights", href: "/blog" },
    { label: "Downloads", href: "/downloads" },
    { label: "Contact", href: "/contact" }
  ] as NavLink[],

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    about:
      "Chesly.Tech is a Johannesburg-based creative studio and AI-first technology publication helping South African businesses build a modern digital presence. We cover AI, startups, SEO/GEO, and digital marketing — and design and build the websites, brands, and content that put businesses on the map.",
    ctaButton: { label: "Visit Chesly.Tech", href: "https://chesly.tech/" },
    firstColumnWidthPx: 380,
    services: [
      { label: "Website Design", href: "https://chesly.tech/#services" },
      { label: "Graphic Design", href: "https://chesly.tech/#services" },
      { label: "SEO", href: "https://chesly.tech/#services" },
      { label: "AI Solutions", href: "https://chesly.tech/#services" },
      { label: "Digital Marketing", href: "https://chesly.tech/#services" },
      { label: "Brand Strategy", href: "https://chesly.tech/#services" }
    ] satisfies FooterLink[],
    resources: [
      { label: "Insights", href: "/blog" },
      { label: "Downloads", href: "/downloads" },
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

  // ── Utility Bar ──────────────────────────────────────────────────────────
  utilityBar: {
    greetings: { morning: "Good Morning", afternoon: "Good Afternoon", evening: "Good Evening" }
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

  // ── Breadcrumb / Page Hero ───────────────────────────────────────────────
  pageHero: {
    backgroundImage: "https://ik.imagekit.io/mkvu8hdr5/insights/typing.jpg",
    overlayOpacity: 0.68, // ~32-40% background image visibility = darker overlay for contrast
    heightPx: 280
  },

  // ── Page intros (shown in the page hero subtitle) ───────────────────────
  pages: {
    blog: {
      title: "Insights",
      intro:
        "Explore expert insights covering Artificial Intelligence, SEO, Google AI Search, digital marketing, cybersecurity, startups and emerging technology. Every article is written to help professionals and businesses stay ahead."
    },
    about: {
      title: "About Us",
      intro:
        "Chesly Insights is a South African technology publication focused on AI, digital innovation and business growth — helping founders, marketers and professionals make sense of a fast-moving industry."
    },
    contact: {
      title: "Contact Us",
      intro:
        "We welcome partnerships, media enquiries, collaborations and general communication. Tell us what you're working on and we'll get back to you."
    },
    downloads: {
      title: "Downloads",
      intro:
        "Free and premium resources — templates, guides and tools — built to help South African businesses put AI, SEO and digital strategy into practice."
    },
    spazaSupport: {
      title: "Spaza Support",
      intro:
        "AI, business and technology guidance built specifically for South African Spaza Shop owners — practical tools to run a smarter, more profitable shop."
    },
    category: {
      title: "Categories"
    }
  },

  editorsNote: {
    body:
      "Every week, we bring you the AI, technology, SEO and digital marketing insights that matter most to South African businesses, founders and marketers—without the hype. Thanks for reading.",
    signature: "Chesly Silaule, Chesly.Tech"
  },

  downloads: [
    {
      title: "AI Readiness Checklist for SMEs",
      description: "A practical checklist to assess whether your business is ready to adopt AI tools.",
      format: "PDF",
      status: "Coming Soon"
    },
    {
      title: "South African SEO Starter Guide",
      description: "Foundational SEO steps tailored to ranking in South African search results.",
      format: "PDF",
      status: "Coming Soon"
    },
    {
      title: "Content Calendar Template",
      description: "A ready-to-use spreadsheet for planning a month of AI-assisted content.",
      format: "XLSX",
      status: "Coming Soon"
    },
    {
      title: "Spaza Shop Digital Toolkit",
      description: "A starter pack of digital tools and AI prompts for township retailers.",
      format: "PDF",
      status: "Coming Soon"
    }
  ] satisfies DownloadItem[],

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
