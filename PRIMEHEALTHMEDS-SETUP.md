# Prime Health Meds — Setup & Handoff Notes

The site lives inside this repo at `/primehealthmeds/*` (e.g.
`insights.chesly.tech/primehealthmeds`), reusing the Insights CMS backend
rather than duplicating it — same pattern as LCD Khaya (see
`LCDKHAYA-SETUP.md`). Real domain DNS pointing (`primehealthmeds.co.za`)
and a host-rewrite are still open — no `middleware.ts` exists in this repo
yet for either client, so that step is future work, not done.

This environment could not reach `primehealthmeds.co.za` (outbound access
to that domain is blocked here), so none of the real WooCommerce catalog,
branding, or copy could be pulled in automatically. Everything shipped here
is a working **platform**, seeded with clearly-marked placeholder content.

## What's new in core (reusable — not Prime Health Meds-specific)

This is the "Products" e-commerce module the CMS platform bible calls for,
distinct from the existing `downloads` table (which stays the *digital*
goods catalog — toolkits, PDFs, instant delivery, no stock).

- **`products` table** (`supabase-migration-6-products.sql`) — physical,
  inventory-tracked products: price, compare-at price, SKU, stock
  quantity, prescription flag, gallery images, SEO fields. Scoped per
  client via a `site` column (e.g. `'primehealthmeds'`) so any future
  physical-goods client reuses this same table instead of a new one.
- **`categories.site`** — the existing shared category table now supports
  the same per-client scoping, so a client's 30-40 product categories
  never mix into Insights' own blog/downloads category pickers.
- **Admin**: `/admin/products` (full CRUD, catalog switcher) and
  `/admin/categories` (now has a "Catalog" switcher — Insights vs. Prime
  Health Meds). Sidebar has a new **Products** entry.
- **Cart/checkout**: `CartItem` now carries `type` (`digital`/`physical`),
  `site`, and `quantity` (was always 1). Physical items get a quantity
  stepper in `/cart`, and checkout collects a delivery address when the
  cart has any physical item.
- **Fulfillment** (`lib/orders.ts`): orders can now mix digital + physical
  line items. Digital items still mint a download token as before;
  physical items decrement `products.stock_quantity` and skip the
  download-token flow entirely (a physical item never had a `downloads`
  row to token against). The confirmation email adapts per order shape.
- **Invoice**: now shows quantity and line totals, plus a delivery
  address block when the order has one.

## What's Prime Health Meds-specific

- `src/lib/primehealthmeds/config.ts` — branding, contact info, nav, FAQs.
  **Every value in this file is a placeholder** — colours are a neutral
  teal/green healthcare palette, not the real brand; phone/address are
  literally the string `"PLACEHOLDER — add real …"`. Edit this file once
  you have the real branding.
- `src/app/primehealthmeds/*` — home, shop (all products), category
  listing, product detail, blog (reuses Insights posts tagged
  `primehealthmeds`), FAQ (config-driven), about, contact, sitemap, robots.
- **Sample catalog**: 5 categories, 10 placeholder products (all
  unpublished by default) seeded by the SQL migration — enough to exercise
  every screen without claiming to be the real ~200-product, 30-40-category
  catalog. Every seeded product name/price/description is marked
  `PLACEHOLDER` in its description.

## What you still need to supply

1. **Run the migration** — `supabase-migration-6-products.sql` in the
   Supabase SQL editor (adds `products`, scopes `categories`, adds
   shipping columns to `orders`, seeds the 5 sample categories + 10
   placeholder products).
2. **Real catalog** — enter it via `/admin/products` (Catalog: Prime
   Health Meds) and `/admin/categories`. For ~200 products, doing this by
   hand in the admin UI works but is slow — if you can export the
   WooCommerce catalog (Products → Export CSV in WP-admin, or a full XML
   export), send it over and it can be bulk-imported instead of entered
   one by one.
3. **Real branding** — logo, brand colours, phone, address, socials — all
   in `src/lib/primehealthmeds/config.ts`.
4. **Real FAQs** — delivery, prescriptions, returns/refunds policy —
   `config.ts`'s `faqs` array is currently all placeholder text.
5. **Domain DNS** — point `primehealthmeds.co.za` at this Vercel project
   once ready, and add a `middleware.ts` host-rewrite (neither exists yet
   for LCD Khaya either — this is shared future work, not started).

## Agreed, not yet built (do next session — see CLAUDE.md rule 5, no credit spent on these until asked)

- **Admin bulk actions on `/admin/products`** — select multiple products in
  the table and publish/unpublish/delete them together, instead of one row
  at a time. Matters once the real ~200-product catalog is loaded.
- **VAT-inclusive pricing** — switch product prices shown on the storefront
  to already include SA's 15% VAT (the retail-display norm here), rather
  than adding a separate tax column. Small change, confirmed direction,
  not yet implemented.

## Deliberately not built (decided against for now, not just deferred)

- **Customer accounts** (shopper login/order history) — checkout stays
  guest-checkout by email, same as the existing digital-downloads flow.
  Confirmed with Chesly this isn't needed for Prime Health Meds — it
  stays available as a future platform feature for whichever client
  actually needs it, not built here speculatively.

## Still open / needs a decision before building

- **Prescription upload** — `requires_prescription` is a flag admins can
  set per product, but there's no upload-a-prescription flow at checkout
  yet. Needs a decision on how Prime Health Meds actually wants to
  receive/verify prescriptions before building it.
- **Bulk CSV import** for the ~200-product catalog — not built; see "Real
  catalog" above. Worth it once a real WooCommerce export is in hand.
