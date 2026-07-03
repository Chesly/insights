# Pre-Launch Checklist

Work through this top to bottom before pointing the live domain at this site.

## 1. Content

- [ ] Replace the placeholder cover image (`chesly.tech_logo.png`, currently
      reused on every sample post) with real per-article featured images
- [ ] Review and expand/replace the 7 sample MDX posts in `content/posts/`
      with real launch content
- [ ] Confirm every post has accurate `publishedDate` / `modifiedDate`
- [ ] Set `draft: false` only on posts actually ready to publish
- [ ] Proofread all copy — spelling, ZAR currency formatting, South African
      English conventions
- [ ] Confirm `lib/authors.ts` has correct bio, photo, and social links for
      every byline used

## 2. Configuration

- [ ] Confirm `siteConfig.url` in `lib/config.ts` matches the exact final
      public URL (domain + protocol + any path prefix) — everything SEO
      (canonical tags, sitemap, RSS, OG images, JSON-LD) derives from this
- [ ] Confirm `siteConfig.logo` and `siteConfig.favicon` URLs are live and
      return real images (not 404s) — the whole site reads these from
      `chesly.tech/insights/images/`
- [ ] Decide on subdomain vs. sub-path hosting (see `DEPLOYMENT.md`) *before*
      going live — changing it after indexing means new canonical URLs

## 3. Environment variables

- [ ] `.env.local` (or host dashboard) has real values for any of: GA4, GTM,
      Clarity, Google Search Console verification, Bing verification
- [ ] Confirm none of these were accidentally committed to git — `.env*.local`
      is in `.gitignore`, verify with `git status` before first push

## 4. Build & deploy verification

- [ ] `npm install` completes with no errors
- [ ] `npx tsc --noEmit` reports zero errors
- [ ] `npm run build` completes with no errors and no unexpected warnings
- [ ] `npm start` (or the standalone `node server.js`) serves the homepage,
      a blog post, and returns a real 404 for an unknown path
- [ ] Deployed environment matches Node 18.18+ (20.x recommended)

## 5. SEO fundamentals

- [ ] `/sitemap.xml` loads and lists real article/category/tag/author URLs
- [ ] `/robots.txt` loads, allows the right paths, and its `Sitemap:` line
      points at the live domain
- [ ] `/rss.xml` validates (test at validator.w3.org/feed)
- [ ] Every page has a unique `<title>` and meta description (spot-check a
      handful with view-source)
- [ ] Canonical URLs match the actual page URL on every template
- [ ] `view-source` on a blog post shows Article, Breadcrumb, and (if the post
      has FAQ frontmatter) FAQPage JSON-LD, and it's valid — test at
      [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- [ ] Open Graph image renders correctly when a post URL is pasted into
      Slack/X/LinkedIn/WhatsApp (test at
      [opengraph.xyz](https://www.opengraph.xyz) or platform-specific debuggers)
- [ ] Twitter Card debugger shows `summary_large_image` correctly (X's own
      card validator is currently unreliable — cross-check with opengraph.xyz)

## 6. Search Console / Bing / Analytics

- [ ] Site verified in Google Search Console (via the HTML-tag method wired
      into this project, or DNS if you prefer)
- [ ] Sitemap submitted in Search Console
- [ ] Site verified in Bing Webmaster Tools; sitemap submitted there too
      (Bing Webmaster also auto-imports from Search Console if linked)
- [ ] GA4 property receiving real-time hits when you browse the live site
- [ ] GTM container publishing correctly (check GTM Preview mode)
- [ ] Clarity recording sessions (check the Clarity dashboard after a test visit)

## 7. Accessibility

- [ ] Tab through the homepage and a blog post using only the keyboard —
      focus is always visible and in a logical order
- [ ] Skip-to-content link works (press Tab once on page load)
- [ ] Run an automated pass (Lighthouse or axe DevTools) and confirm no
      critical violations
- [ ] Confirm color contrast on gold-on-white text passes at your final
      font sizes (spot-check with a contrast checker if you change the
      palette)

## 8. Performance

- [ ] Run Lighthouse (mobile + desktop) on the homepage and a blog post on
      the **live** deployment, not localhost
- [ ] Replace any remaining oversized/unoptimized images
- [ ] Confirm images are actually served by Next's image optimizer in
      production (check Network tab for `/_next/image` requests)

## 9. Legal / trust

- [ ] Privacy Policy, Terms, and Disclaimer pages reviewed by a human (these
      are starting templates, not legal advice)
- [ ] Contact form actually sends somewhere (see item below — it's UI-only
      right now)
- [ ] Newsletter form connected to a real provider (Mailchimp/ConvertKit/etc.)
      — it is currently a non-functional placeholder `<form>`

## 10. Known non-blockers (fine to launch without, listed for awareness)

- Contact and newsletter forms have no backend wired up yet
- CSP allows `'unsafe-inline'`/`'unsafe-eval'` for script-src (needed for the
  inline GA/GTM snippets as implemented) — fine for launch, a nonce-based CSP
  is a future hardening step
- PWA manifest link is emitted as root-relative; only matters if you deploy
  under a sub-path rather than a dedicated domain/subdomain

## 11. Post-launch (first week)

- [ ] Confirm pages are being indexed (`site:yourdomain.com` in Google after
      a few days)
- [ ] Watch Search Console "Coverage" report for crawl errors
- [ ] Watch GA4 real-time + Clarity for obvious UX problems (rage clicks,
      dead clicks)
- [ ] Re-run Lighthouse a week in, once real images/content are live, to get
      accurate scores
