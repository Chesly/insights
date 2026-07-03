export const siteConfig = {
  name: "Chesly.Tech Insights",
  shortName: "Chesly.Tech",
  description:
    "AI, startups, technology, SEO, GEO, and digital marketing insights with a South Africa-first perspective — from Chesly.Tech.",
  url: "https://chesly.tech/insights",
  logo: "https://chesly.tech/insights/images/chesly.tech_logo.png",
  favicon: "https://chesly.tech/insights/images/favco.png",
  locale: "en_ZA",
  language: "en-ZA",
  twitter: "@CheslyTech",
  owner: {
    name: "Chesly Silaule",
    email: "hello@chesly.tech",
    role: "Owner, Designed and Developed by",
    url: "https://chesly.tech"
  },
  colors: {
    primary: "#8B6914",
    secondary: "#1B2A4A"
  },
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
  nav: [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/blog" },
    { label: "Categories", href: "/category" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ]
};

export type SiteConfig = typeof siteConfig;
