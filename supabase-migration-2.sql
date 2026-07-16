-- ============================================================
-- MIGRATION 2 — multi-category, freeform byline, AI-search fields
-- Run this AFTER supabase-schema.sql, in Supabase SQL Editor.
-- Safe to run once. Do not re-run.
-- ============================================================

-- ── POST CATEGORIES (many-to-many, in addition to posts.category_id
--    which stays as the "primary" category for simple queries) ──
CREATE TABLE public.post_categories (
  post_id     UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view post categories" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "Editors can manage post categories" ON public.post_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── Freeform byline (content author ≠ login user) ────────────
ALTER TABLE public.posts ADD COLUMN author_name TEXT;
ALTER TABLE public.posts ADD COLUMN author_slug TEXT;

-- ── AI Search Optimization fields ────────────────────────────
ALTER TABLE public.posts ADD COLUMN ai_summary TEXT;
ALTER TABLE public.posts ADD COLUMN key_takeaways JSONB DEFAULT '[]';
ALTER TABLE public.posts ADD COLUMN faq JSONB DEFAULT '[]';               -- [{question, answer}]
ALTER TABLE public.posts ADD COLUMN definitions JSONB DEFAULT '[]';       -- [{question, answer}]
ALTER TABLE public.posts ADD COLUMN expert_insight TEXT;
ALTER TABLE public.posts ADD COLUMN comparison_table JSONB;
ALTER TABLE public.posts ADD COLUMN pros JSONB DEFAULT '[]';
ALTER TABLE public.posts ADD COLUMN cons JSONB DEFAULT '[]';
ALTER TABLE public.posts ADD COLUMN related_topics JSONB DEFAULT '[]';
ALTER TABLE public.posts ADD COLUMN suggested_questions JSONB DEFAULT '[]';
ALTER TABLE public.posts ADD COLUMN semantic_keywords JSONB DEFAULT '[]';
ALTER TABLE public.posts ADD COLUMN how_to_steps JSONB DEFAULT '[]';      -- [{name, text}]
ALTER TABLE public.posts ADD COLUMN keywords JSONB DEFAULT '[]';

-- ── Missing categories used by existing content ──────────────
INSERT INTO public.categories (name, slug, description, icon, color)
SELECT 'Finance', 'finance', 'Money, funding, and financial planning', '💰', '#8B6914'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'finance');

INSERT INTO public.categories (name, slug, description, icon, color)
SELECT 'AI', 'ai', 'AI tools, prompts, and strategies', '🤖', '#1B2A4A'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'ai');

-- Helper view: fetch a post with all its categories as an array (used by the site)
CREATE OR REPLACE VIEW public.posts_with_categories
WITH (security_invoker = true) AS
SELECT
  p.*,
  pc_primary.name AS primary_category_name,
  pc_primary.slug AS primary_category_slug,
  COALESCE(
    (SELECT jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'color', c.color))
     FROM public.post_categories pc
     JOIN public.categories c ON c.id = pc.category_id
     WHERE pc.post_id = p.id),
    '[]'::jsonb
  ) AS categories_json,
  COALESCE(
    (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
     FROM public.post_tags pt
     JOIN public.tags t ON t.id = pt.tag_id
     WHERE pt.post_id = p.id),
    '[]'::jsonb
  ) AS tags_json
FROM public.posts p
LEFT JOIN public.categories pc_primary ON pc_primary.id = p.category_id;
