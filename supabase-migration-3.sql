-- ============================================================
-- MIGRATION 3 — manual related-content links (products <-> posts)
-- Run this AFTER supabase-migration-2.sql, in Supabase SQL Editor.
-- Safe to run once. Do not re-run.
-- ============================================================

-- Lets an admin manually curate which OTHER products and blog posts show
-- as "related" on a product page, and which product(s) show as "related"
-- on a blog post — on top of (not instead of) the existing automatic
-- same-category matching. Used to build internal-linking clusters for SEO
-- (e.g. a toolkit product <-> the blog posts that sell it).
ALTER TABLE public.downloads ADD COLUMN related_download_ids UUID[] DEFAULT '{}';
ALTER TABLE public.downloads ADD COLUMN related_post_ids UUID[] DEFAULT '{}';
ALTER TABLE public.posts ADD COLUMN related_download_ids UUID[] DEFAULT '{}';
