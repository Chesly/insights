-- Meta Ads tracking layer — owned attribution store for insights.chesly.tech.
-- Ads Manager tells you what Meta wants you to know. This tells you the truth.
-- Written server-side only (SUPABASE_SERVICE_ROLE_KEY, via lib/meta/server.ts)
-- from both /api/meta/capi (browser-fired events) and lib/orders.ts
-- (server-fired Purchase) — never from the browser directly.

CREATE TABLE public.ad_events (
  id                 BIGSERIAL PRIMARY KEY,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_name         TEXT        NOT NULL,
  event_id           TEXT        NOT NULL,
  event_source_url   TEXT,
  email_hash         TEXT,           -- sha256 only, never plaintext
  value              NUMERIC(12,2),
  currency           TEXT,
  utm_source         TEXT,
  utm_medium         TEXT,
  utm_campaign       TEXT,
  utm_content        TEXT,           -- use this for the ad/creative name
  fbclid             TEXT,
  landing_path       TEXT,
  referrer           TEXT,
  custom_data        JSONB       NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX ad_events_created_at_idx ON public.ad_events (created_at DESC);
CREATE INDEX ad_events_name_idx ON public.ad_events (event_name);
CREATE INDEX ad_events_campaign_idx ON public.ad_events (utm_campaign);
CREATE INDEX ad_events_content_idx ON public.ad_events (utm_content);
CREATE UNIQUE INDEX ad_events_event_id_idx ON public.ad_events (event_id, event_name);

-- Locked down: only the service-role key (lib/meta/server.ts) writes here,
-- same pattern as calculator_leads and orders elsewhere in this repo.
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view ad events" ON public.ad_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);

-- ---------------------------------------------------------------------------
-- View 1: the funnel, per campaign. Answers "where do people fall out?"
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.ad_funnel AS
SELECT
  COALESCE(utm_campaign, '(none)')                                AS campaign,
  COALESCE(utm_content, '(none)')                                 AS creative,
  DATE_TRUNC('day', created_at)                                   AS day,
  COUNT(*) FILTER (WHERE event_name = 'PageView')                 AS pageviews,
  COUNT(*) FILTER (WHERE event_name = 'ViewContent')              AS calc_views,
  COUNT(*) FILTER (WHERE event_name = 'CalculatorCompleted')      AS calc_completed,
  COUNT(*) FILTER (WHERE event_name = 'Lead')                     AS leads,
  COUNT(*) FILTER (WHERE event_name = 'ToolkitCtaClick')          AS toolkit_clicks,
  COUNT(*) FILTER (WHERE event_name = 'InitiateCheckout')         AS checkouts,
  COUNT(*) FILTER (WHERE event_name = 'Purchase')                 AS purchases,
  COALESCE(SUM(value) FILTER (WHERE event_name = 'Purchase'), 0)  AS revenue_zar
FROM public.ad_events
GROUP BY 1, 2, 3;

-- ---------------------------------------------------------------------------
-- View 2: the only three numbers that decide whether to spend more.
--   cost_per_lead  -> is the offer working?
--   lead_to_sale   -> is the email sequence working?
--   revenue        -> did any of this pay?
-- Enter spend manually per campaign; Meta will not hand it to you here.
-- ---------------------------------------------------------------------------
CREATE TABLE public.ad_spend (
  campaign    TEXT PRIMARY KEY,
  spend_zar   NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ad_spend ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage ad spend" ON public.ad_spend FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);

CREATE OR REPLACE VIEW public.ad_scorecard AS
SELECT
  f.campaign,
  s.spend_zar,
  SUM(f.pageviews)      AS pageviews,
  SUM(f.leads)          AS leads,
  SUM(f.purchases)      AS purchases,
  SUM(f.revenue_zar)    AS revenue_zar,
  CASE WHEN SUM(f.leads) > 0
       THEN ROUND(s.spend_zar / SUM(f.leads), 2) END          AS cost_per_lead,
  CASE WHEN SUM(f.leads) > 0
       THEN ROUND(100.0 * SUM(f.purchases) / SUM(f.leads), 1) END AS lead_to_sale_pct,
  CASE WHEN s.spend_zar > 0
       THEN ROUND(SUM(f.revenue_zar) / s.spend_zar, 2) END    AS roas
FROM public.ad_funnel f
LEFT JOIN public.ad_spend s ON s.campaign = f.campaign
GROUP BY f.campaign, s.spend_zar;

-- ---------------------------------------------------------------------------
-- Orders: carry the click ids + first-touch UTMs captured at add-to-cart
-- time through to fulfillment, so the Purchase event fired server-side from
-- lib/orders.ts (which runs off the Paystack webhook, with no cookies of
-- its own to read) still has Event Match Quality worth having.
-- ---------------------------------------------------------------------------
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ad_attribution JSONB;
