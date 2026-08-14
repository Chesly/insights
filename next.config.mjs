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
    // Permanent — /downloads and /blog were indexed under the old paths
    // (see Search Console), so these 301s carry that ranking/link equity
    // over to /tools and /insights instead of leaving 404s behind.
    return [
      { source: "/downloads", destination: "/tools", permanent: true },
      { source: "/downloads/:slug", destination: "/tools/:slug", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
      // A batch of post slugs were originally saved with inconsistent
      // capitalization (e.g. "What-is-purchase-order-funding"), which
      // broke every other post's internal link to them since every link
      // was authored using the standard all-lowercase form. Slugs were
      // normalized to lowercase in the DB; these carry over anyone who
      // still has the old mixed-case URL (search engines, bookmarks).
      { source: "/insights/10-AI-Business-Ideas-You-Can-Start-in-South-Africa-Without-Quitting-Your-Job", destination: "/insights/10-ai-business-ideas-you-can-start-in-south-africa-without-quitting-your-job", permanent: true },
      { source: "/insights/10-Business-Tasks-You-Should-Automate-First", destination: "/insights/10-business-tasks-you-should-automate-first", permanent: true },
      { source: "/insights/10-Small-Businesses-You-Can-Start-Alongside-Spaza-Shop", destination: "/insights/10-small-businesses-you-can-start-alongside-spaza-shop", permanent: true },
      { source: "/insights/5-AI-Automation-Tools-Every-South-African-Business-Should-Know-About", destination: "/insights/5-ai-automation-tools-every-south-african-business-should-know-about", permanent: true },
      { source: "/insights/50-Products-Every-South-African-Spaza-Shop-Should-Stock", destination: "/insights/50-products-every-south-african-spaza-shop-should-stock", permanent: true },
      { source: "/insights/7-AI-Skills-That-Will-Make-You-More-Valuable-in-the-Next-Five-Years", destination: "/insights/7-ai-skills-that-will-make-you-more-valuable-in-the-next-five-years", permanent: true },
      { source: "/insights/Everything-You-Need-Before-Applying-for-Spaza-Shop-Funding", destination: "/insights/everything-you-need-before-applying-for-spaza-shop-funding", permanent: true },
      { source: "/insights/How-to-Apply-for-Spaza-Shop-Funding-in-South-Africa", destination: "/insights/how-to-apply-for-spaza-shop-funding-in-south-africa", permanent: true },
      { source: "/insights/How_Get_Import_Export_Code_South_Africa", destination: "/insights/how-get-import-export-code-south-africa", permanent: true },
      { source: "/insights/National-eTender-Portal-Registration", destination: "/insights/national-etender-portal-registration", permanent: true },
      { source: "/insights/What-is-purchase-order-funding", destination: "/insights/what-is-purchase-order-funding", permanent: true },
      { source: "/insights/Step-by-Step-Guide-How-Register-Import-Export", destination: "/insights/step-by-step-guide-how-register-import-export", permanent: true },
      { source: "/insights/How-Small-Businesses-Can-Use-AI-to-Save-20-Hours-Every-Week", destination: "/insights/how-small-businesses-can-use-ai-to-save-20-hours-every-week", permanent: true },
      { source: "/insights/The-business-just-incase", destination: "/insights/the-business-just-incase", permanent: true },
      { source: "/insights/Creative-fusion-of-analog-and-digital", destination: "/insights/creative-fusion-of-analog-and-digital", permanent: true },
      { source: "/insights/Should-You-Encourage-Your-Daughter-to-Play-Football", destination: "/insights/should-you-encourage-your-daughter-to-play-football", permanent: true },
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
