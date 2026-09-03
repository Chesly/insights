-- Calculator "email me my results" capture.
--
-- Powers the optional email-results form on the calculators (starting with
-- the Tender Bid/No-Bid calculator — src/components/TenderCalculator.tsx).
-- A visitor never has to fill this in to see their results; it only fires
-- if they choose to have a copy emailed to them, same pattern as the free
-- digital-download lead capture (download_leads / newsletter_subscribers).
--
-- Run this in the Supabase SQL editor before the calculator's email form
-- will work. The API route at
-- src/app/api/public/calculators/[slug]/results/route.ts writes here with
-- the service-role client (same reasoning as newsletter_subscribers and
-- contact_messages: anon-key RLS inserts don't reliably pass in
-- production), so the RLS policy below only governs the authenticated
-- admin read.

CREATE TABLE public.calculator_leads (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calculator_slug    TEXT NOT NULL,
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  newsletter_opt_in  BOOLEAN DEFAULT FALSE,
  results            JSONB NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX calculator_leads_slug_idx ON public.calculator_leads (calculator_slug);
CREATE INDEX calculator_leads_email_idx ON public.calculator_leads (email);

ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view calculator leads" ON public.calculator_leads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);
