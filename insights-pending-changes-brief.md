# insights.chesly.tech — Pending Changes Brief (for Claude Code)

Context: repo was stuck on a broken clone (Windows couldn't check out a `[slug]` folder with stray spaces in its name). That's fixed and the repo is clean and synced. These are the feature changes that were incomplete/failed before and need finishing in Claude Code.

---

## 1. Product Page (individual digital product, e.g. `/downloads/[slug]`)

Standard e-commerce product page layout, top to bottom:
1. Product info block — title, price, description, download tiers (Free/Premium/On Sale), buy button
2. **Related products** section directly below product info
3. **Latest 4 blog posts** section below that (not necessarily related to the product — just the site's most recent posts)

This should look and behave like a normal commercial product page (Shopify/standard e-comm pattern), not a bespoke layout.

## 2. Shop / Cart / Checkout

Shop page should list all products (all downloads) in a normal storefront grid.
Cart/checkout must be **fully functional**: user enters info (name, email, etc.) → completes purchase → Paystack flow (already integrated) fires correctly. Confirm this end-to-end, since prior attempts left it incomplete.

## 3. Blog — Individual Post Page

WordPress-style single post layout:
- Tags
- Categories
- Related/similar posts section

## 4. Blog — Landing Pages (all three: `/`, `/blog`, `/coffee` on insights.chesly.tech)

- **Do NOT** show a heavy list/grid of all categories at the top — it wastes space and adds clutter
- Layout: **1 featured post** at top → a visual divider line → then the full list of all blog posts below (grid style, see confirmed design reference above)
- Add a **Products teaser section at the bottom** of each of these three pages (see confirmed design reference above)

## 5. Home Page

- Remove/simplify any block that's just a list of blog categories — same "wastes space" reasoning as #4. Confirm exactly what's on the home page currently before touching it.

## 6. Footer

- Replace the current insights.chesly.tech footer with the **new chesly.tech footer style** (four-column: Company / Services / Resources / Contact — the standardized footer already in use on chesly.tech).
- Apply site-wide across insights.chesly.tech.

---

## Correction: "Let's Have Coffee" is not a second site
It's a page on insights.chesly.tech itself: `/coffee`. Same treatment applies to all three landing pages on the same domain:
- `https://insights.chesly.tech/` (home)
- `https://insights.chesly.tech/blog`
- `https://insights.chesly.tech/coffee`

## Confirmed design references (Chesly-approved, screenshots on file)

**Blog landing page style** — reference: minimalist "The Blog" layout (bold page heading, one large full-width featured post card at top — image left, title/date right — then a clean 3-column grid of post cards below, each with thumbnail, date, title, short excerpt). Lots of white space, no heavy category filter block. Apply this exact structure to all three landing pages above.

**Products teaser section at the bottom of blog landing pages** — reference: simple product-card row style (product image, name, short description, price, Add to Cart button, one card in a "highlighted/featured" state with a colored background). Add this as a section at the bottom of `/`, `/blog`, and `/coffee`, styled simply — not cluttered, and controllable from the backend.

**Products/shop catalog page** — reference: clean card grid layout (product image, name, price, rating — one product per card, uniform grid, minimal clutter, image-forward). Use this for the main shop/catalog listing page.

General principle across all of the above: **keep it simple, not cluttered** — this all needs to be manageable from the backend admin panel (see Backend section below), so avoid overly complex layouts that are hard to make dynamic/editable.

## Other reference sites (general inspiration, not the primary spec)
- Blog layout: Stripe blog, Intercom blog, Notion blog
- Digital product / shop pages: Gumroad, Payhip

## 7. CRITICAL BUG — Digital product links broken
All digital product links are breaking on the live site. This is likely the top-priority fix — it's probably also the cause of the Google Search Console indexing problem below.

## 8. Backend / Admin Panel
Current admin backend is not mobile-responsive at all — needs a full mobile pass.
Backend must support:
- [ ] Upload images
- [ ] Upload/manage digital products (currently bugged — same root issue as #7 above, likely)
- [ ] Edit footer content
- [ ] Edit main logo
- [ ] Edit footer logo
- [ ] Edit social media links
- [ ] Edit contact details
- [ ] Edit contact form destination email
- [ ] Edit newsletter destination email

## 9. SEO / Indexing diagnosis (from Google Search Console export, 13 Aug 2026)
- 170 pages indexed, 44 not indexed (41 "Discovered – currently not indexed", 3 "Crawled – currently not indexed")
- Site is young (indexing only began 8 July) so some of this is expected
- Working theory: broken digital product links (#7) are causing Google to deprioritize/skip indexing those pages and may be dragging down crawl trust site-wide
- **Action: fix #7 first, then re-submit affected URLs in Search Console and monitor whether "not indexed" count drops over the following weeks**

---

## Suggested build order
1. **Fix broken digital product links (#7)** — top priority, likely also fixes the indexing problem
2. Footer swap (fast, low-risk, site-wide win)
3. Blog landing page restructure (featured + divider + list, remove category clutter) — insights.chesly.tech, then Let's Have Coffee once confirmed
4. Blog single-post layout (tags/categories/related)
5. Home page category-list cleanup
6. Product page restructure (info → related products → latest 4 posts)
7. Shop/cart/checkout functional test end-to-end (touches Paystack/payment flow)
8. Backend admin panel — mobile responsiveness + content/logo/contact/newsletter management
9. Re-submit fixed product URLs in Search Console, monitor indexing over following weeks
