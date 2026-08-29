-- ============================================================
-- MIGRATION 3 — LCD Khaya Driving School bookings
-- Run this AFTER supabase-schema.sql and supabase-migration-2.sql,
-- in Supabase SQL Editor. Safe to run once. Do not re-run.
--
-- Blog posts and "Did You Know" facts for LCD Khaya reuse the existing
-- posts/facts tables (filtered by tag "lcdkhaya" / category "Driving" —
-- see src/lib/lcdkhaya/config.ts), so no new tables are needed for those.
-- Bookings get their own table because fulfilling a driving-lesson
-- booking (confirmation email) is nothing like fulfilling a digital
-- product order (download tokens) — see src/lib/lcdkhaya/bookings.ts.
-- ============================================================

CREATE TABLE public.lcdkhaya_bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paystack_reference TEXT UNIQUE NOT NULL,
  package_id        TEXT NOT NULL,
  package_name      TEXT NOT NULL,
  amount            NUMERIC(10,2) NOT NULL DEFAULT 0,
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  preferred_area    TEXT,
  preferred_date    TEXT,
  notes             TEXT,
  newsletter_opt_in BOOLEAN NOT NULL DEFAULT false,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at      TIMESTAMPTZ
);

ALTER TABLE public.lcdkhaya_bookings ENABLE ROW LEVEL SECURITY;

-- Public inserts/updates go through the service-role client only (same
-- pattern as `orders` and `contact_messages` — see route handlers), so
-- the only policy needed here is read access for signed-in staff.
CREATE POLICY "Admins can view bookings" ON public.lcdkhaya_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor'))
);

CREATE INDEX lcdkhaya_bookings_status_idx ON public.lcdkhaya_bookings (status);
CREATE INDEX lcdkhaya_bookings_created_at_idx ON public.lcdkhaya_bookings (created_at DESC);
