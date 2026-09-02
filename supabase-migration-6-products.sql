-- ============================================================
-- CHESLY CMS — PRODUCTS / E-COMMERCE MODULE
-- Run this in your Supabase SQL editor (Project > SQL Editor)
--
-- Adds the reusable "physical products" catalog the platform bible
-- calls for (Products, Categories, Inventory, Orders) — distinct from
-- `downloads`, which stays the digital-goods catalog (toolkits, PDFs).
-- Built for Prime Health Meds (insights.chesly.tech/primehealthmeds)
-- but scoped by `site` so any future client with a physical-goods shop
-- reuses this same table instead of a new one.
-- ============================================================

-- ── CATEGORIES: add tenant scoping ───────────────────────────
-- NULL `site` = the existing shared blog/download categories (Insights).
-- A non-null `site` scopes a category tree to one client's catalog
-- (e.g. 'primehealthmeds') so it never mixes into Insights' own
-- category pickers. Backward compatible — every existing row gets NULL.
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS site TEXT;
CREATE INDEX IF NOT EXISTS categories_site_idx ON public.categories (site);

-- ── PRODUCTS ─────────────────────────────────────────────────
CREATE TABLE public.products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site                TEXT NOT NULL,              -- e.g. 'primehealthmeds' — which client catalog this belongs to
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL,
  sku                 TEXT,
  short_description   TEXT,
  description         TEXT,
  category_id         UUID REFERENCES public.categories(id),
  price               NUMERIC(10,2) NOT NULL DEFAULT 0,
  compare_at_price    NUMERIC(10,2),
  currency            TEXT NOT NULL DEFAULT 'ZAR',
  track_stock         BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity      INT NOT NULL DEFAULT 0,
  requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
  thumbnail_url       TEXT,
  gallery_images      JSONB NOT NULL DEFAULT '[]',
  tags                JSONB NOT NULL DEFAULT '[]',
  seo_title           TEXT,
  meta_description    TEXT,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (site, slug)
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are public" ON public.products FOR SELECT USING (is_published = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);
CREATE INDEX products_site_idx ON public.products (site);
CREATE INDEX products_category_idx ON public.products (category_id);

-- ── ORDERS: shipping + tenant fields for physical goods ──────
-- `orders` already exists (created by an earlier, undocumented migration
-- that shipped with the checkout system — see src/lib/orders.ts). These
-- columns are additive so existing digital-download orders are untouched.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS site TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_city TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_status TEXT DEFAULT NULL CHECK (shipping_status IS NULL OR shipping_status IN ('pending','shipped','delivered'));

-- ============================================================
-- SEED: Prime Health Meds — sample categories + placeholder products
-- Real catalog (~200+ products / 30–40 categories) still needs to be
-- entered via /admin/products once real WooCommerce data is available —
-- see PRIMEHEALTHMEDS-SETUP.md. These ~10 are unpublished placeholders
-- so nothing fake goes live by accident.
-- ============================================================

INSERT INTO public.categories (name, slug, description, icon, color, site) VALUES
  ('Pain Relief', 'pain-relief', 'Painkillers and anti-inflammatories', '💊', '#0f766e', 'primehealthmeds'),
  ('Vitamins & Supplements', 'vitamins-supplements', 'Daily vitamins, minerals and supplements', '🌿', '#16a34a', 'primehealthmeds'),
  ('Cold, Flu & Immune', 'cold-flu-immune', 'Cold, flu and immune-support remedies', '🤧', '#0891b2', 'primehealthmeds'),
  ('Baby & Mother Care', 'baby-mother-care', 'Baby and maternity health products', '🍼', '#db2777', 'primehealthmeds'),
  ('Skin & Personal Care', 'skin-personal-care', 'Skincare, hygiene and personal care', '🧴', '#7c3aed', 'primehealthmeds')
ON CONFLICT DO NOTHING;

INSERT INTO public.products (site, name, slug, sku, short_description, description, category_id, price, compare_at_price, stock_quantity, requires_prescription, is_published)
SELECT 'primehealthmeds', v.name, v.slug, v.sku, v.short_description, v.description, c.id, v.price, v.compare_at_price, v.stock_quantity, v.requires_prescription, FALSE
FROM (VALUES
  ('Paracetamol 500mg (20 tablets)', 'paracetamol-500mg-20-tablets', 'PHM-PAIN-001', 'Fast-acting pain and fever relief.', 'PLACEHOLDER — replace with real product copy. Paracetamol 500mg, 20 tablets, for mild to moderate pain and fever.', 'pain-relief', 45.00, NULL, 100, FALSE),
  ('Ibuprofen 200mg (24 tablets)', 'ibuprofen-200mg-24-tablets', 'PHM-PAIN-002', 'Anti-inflammatory pain relief.', 'PLACEHOLDER — replace with real product copy. Ibuprofen 200mg, 24 tablets.', 'pain-relief', 55.00, 65.00, 80, FALSE),
  ('Vitamin C 1000mg (30 tablets)', 'vitamin-c-1000mg-30-tablets', 'PHM-VIT-001', 'Daily immune support.', 'PLACEHOLDER — replace with real product copy. Vitamin C 1000mg, 30 effervescent tablets.', 'vitamins-supplements', 89.00, NULL, 120, FALSE),
  ('Multivitamin Complete (60 capsules)', 'multivitamin-complete-60-capsules', 'PHM-VIT-002', 'Complete daily multivitamin.', 'PLACEHOLDER — replace with real product copy. A full-spectrum daily multivitamin, 60 capsules.', 'vitamins-supplements', 149.00, 179.00, 60, FALSE),
  ('Zinc + Vitamin D3 (30 capsules)', 'zinc-vitamin-d3-30-capsules', 'PHM-VIT-003', 'Immune and bone health support.', 'PLACEHOLDER — replace with real product copy.', 'vitamins-supplements', 99.00, NULL, 70, FALSE),
  ('Cold & Flu Relief Syrup (100ml)', 'cold-flu-relief-syrup-100ml', 'PHM-CF-001', 'Multi-symptom cold and flu relief.', 'PLACEHOLDER — replace with real product copy.', 'cold-flu-immune', 79.00, NULL, 50, FALSE),
  ('Immune Booster Effervescent (20 tablets)', 'immune-booster-effervescent-20-tablets', 'PHM-CF-002', 'Daily immune-support effervescent.', 'PLACEHOLDER — replace with real product copy.', 'cold-flu-immune', 95.00, NULL, 40, FALSE),
  ('Baby Gripe Water (150ml)', 'baby-gripe-water-150ml', 'PHM-BABY-001', 'Gentle relief for infant colic.', 'PLACEHOLDER — replace with real product copy.', 'baby-mother-care', 65.00, NULL, 45, FALSE),
  ('Prenatal Multivitamin (30 capsules)', 'prenatal-multivitamin-30-capsules', 'PHM-BABY-002', 'Daily prenatal support.', 'PLACEHOLDER — replace with real product copy.', 'baby-mother-care', 159.00, NULL, 35, TRUE),
  ('Aqueous Cream (500g)', 'aqueous-cream-500g', 'PHM-SKIN-001', 'Gentle daily moisturiser.', 'PLACEHOLDER — replace with real product copy.', 'skin-personal-care', 69.00, NULL, 90, FALSE)
) AS v(name, slug, sku, short_description, description, category_slug, price, compare_at_price, stock_quantity, requires_prescription)
JOIN public.categories c ON c.slug = v.category_slug AND c.site = 'primehealthmeds'
ON CONFLICT (site, slug) DO NOTHING;
