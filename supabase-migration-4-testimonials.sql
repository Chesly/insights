-- ============================================================
-- MIGRATION 4 — Testimonials (reusable core module)
-- Run this AFTER supabase-migration-3-lcdkhaya.sql, in Supabase SQL Editor.
-- Safe to run once. Do not re-run.
--
-- Unlike lcdkhaya_bookings (genuinely client-specific), testimonials are
-- exactly the kind of thing the platform-first workflow says belongs in
-- the reusable CMS core rather than a one-off table — Chesly's own CMS
-- platform notes already list "Testimonials" under the planned Business
-- module. Scoped by `site` so any future client site can submit and
-- display its own testimonials from this one table, mirroring the
-- moderation pattern already used for download_reviews (public submits
-- as 'pending', only 'approved' rows are ever shown publicly).
-- ============================================================

CREATE TABLE public.testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site          TEXT NOT NULL DEFAULT 'insights',
  author_name   TEXT NOT NULL,
  author_email  TEXT NOT NULL,
  rating        SMALLINT CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),
  content       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can view all testimonials" ON public.testimonials FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor'))
);

CREATE INDEX testimonials_site_status_idx ON public.testimonials (site, status);
CREATE INDEX testimonials_created_at_idx ON public.testimonials (created_at DESC);
