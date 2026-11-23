/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://www.google-analytics.com https://*.clarity.ms https://analytics.google.com https://*.supabase.co;
  frame-src https://www.googletagmanager.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      // Chesly.tech hosted images (logos, author photos, article images)
      { protocol: "https", hostname: "chesly.tech" },
      { protocol: "https", hostname: "**.chesly.tech" },
      // ImageKit CDN — scoped to the Chesly.Tech project folder
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/mkvu8hdr5/**",
      },
    ],
  },
  async redirects() {
    // Legacy article URLs are resolved by the dynamic /blog/[slug] route.
    // Never add case-only redirects here: Next.js route matching is
    // case-insensitive and those rules create self-redirect loops.
    return [
      { source: "/downloads", destination: "/tools", permanent: true },
      { source: "/downloads/:slug", destination: "/tools/:slug", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      // Consolidated duplicate articles: preserve any existing links/search
      // equity while keeping one canonical page for each search intent.
      { source: "/insights/purchase-order-funding-cost-south-africa", destination: "/insights/how-much-does-purchase-order-funding-cost", permanent: true },
      { source: "/insights/how-to-register-on-etender-portal", destination: "/insights/national-etender-portal-registration", permanent: true },
      { source: "/insights/common-mistakes-purchase-order-funding", destination: "/insights/purchase-order-funding-rejected", permanent: true },
      { source: "/insights/step-by-step-guide-how-register-import-export", destination: "/insights/how-get-import-export-code-south-africa", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;
