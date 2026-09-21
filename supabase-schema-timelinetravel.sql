-- ============================================================
-- TIMELINE TRAVEL — SUPABASE SCHEMA
-- Run this once, in order, in the NEW Timeline Travel Supabase
-- project's SQL Editor (Project > SQL Editor). This is a
-- standalone database — separate from Insights' Supabase project,
-- per the "own Vercel + own Supabase, same GitHub repo" decision.
--
-- This reuses the same CMS core (profiles/categories/tags/media/
-- pages/posts) as Insights, so the same admin code and patterns
-- work unchanged. Posts double as "Travel Tips / Articles" —
-- the spec's Article fields (title, slug, excerpt, body, featured
-- image, category, author, date, SEO) are already exactly what
-- posts provides, so no separate articles table is needed.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── PROFILES (extends Supabase auth.users) ──────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin','admin','editor','viewer')),
  bio         TEXT,
  website     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);

-- ── CATEGORIES (used by Travel Tips articles) ───────────────
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  color       TEXT DEFAULT '#0F3D3E',
  icon        TEXT DEFAULT '🧭',
  parent_id   UUID REFERENCES public.categories(id),
  post_count  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Editors can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Destinations', 'destinations', 'Guides to specific places to visit', '📍'),
  ('Corporate Travel', 'corporate-travel', 'Business and group travel administration', '💼'),
  ('Travel Planning', 'travel-planning', 'Trip logistics, transport and itinerary advice', '🗺️'),
  ('Visa & Insurance', 'visa-insurance', 'Documentation and travel protection', '🛂'),
  ('MICE & Events', 'mice-events', 'Meetings, incentives, conferences and exhibitions', '🎤');

-- ── TAGS ─────────────────────────────────────────────────────
CREATE TABLE public.tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  post_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Editors can manage tags" ON public.tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── MEDIA LIBRARY ────────────────────────────────────────────
CREATE TABLE public.media (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name     TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url           TEXT NOT NULL,
  thumbnail_url TEXT,
  mime_type     TEXT NOT NULL,
  file_size     INT,
  width         INT,
  height        INT,
  alt_text      TEXT,
  caption       TEXT,
  folder        TEXT DEFAULT '/',
  imagekit_id   TEXT,
  uploaded_by   UUID REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view media" ON public.media FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage media" ON public.media FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── PAGES (About, Terms, Privacy, SEO landing pages, etc.) ──
CREATE TABLE public.pages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  body             TEXT,
  body_json        JSONB,
  status           TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  seo_title        TEXT,
  meta_description TEXT,
  og_image         TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages are public" ON public.pages FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- The shared booking terms & conditions (identical boilerplate found
-- across all 9 supplied tour packages: deposit %, cancellation tiers,
-- airline/luggage/liability clauses) live here as ONE page, linked
-- from every tour, rather than duplicated per tour.
INSERT INTO public.pages (title, slug, status) VALUES
  ('Privacy Policy', 'privacy-policy', 'draft'),
  ('Terms & Conditions', 'terms-and-conditions', 'draft');

-- Real content, straight from the client's own supplied documents —
-- published, not draft, since it's already-approved copy, not a
-- placeholder awaiting review.
INSERT INTO public.pages (title, slug, status, body) VALUES
(
  'About Us',
  'about',
  'published',
  $page$<h2>Company Overview</h2>
<p>Timeline Travel is a South African Destination Management Company (DMC) dedicated to delivering professional, reliable, and cost-effective travel management solutions for businesses, government institutions, organizations, groups, and individual travelers.</p>
<p>We specialize in simplifying travel through strategic planning, supplier negotiations, travel coordination, accommodation management, transportation logistics, visa assistance, travel reporting, and destination experiences.</p>
<p><strong>Our mission is simple: to make travel easier, safer, more efficient, and more rewarding for every client we serve.</strong></p>
<p>Whether arranging executive business travel, coordinating conferences and events, planning group tours, or creating unforgettable leisure experiences, Timeline Travel provides a complete end-to-end travel solution.</p>

<h2>Our Vision</h2>
<p>To become Africa's most trusted travel management and destination services partner.</p>

<h2>Our Mission</h2>
<p>To provide seamless travel solutions that save our clients time, reduce costs, improve travel experiences, and create lasting value through innovation, service excellence, and trusted partnerships.</p>

<h2>Our Core Values</h2>
<ul>
<li><strong>Excellence</strong> — We pursue exceptional service in everything we do.</li>
<li><strong>Integrity</strong> — We operate honestly, transparently, and ethically.</li>
<li><strong>Reliability</strong> — Clients can depend on us before, during, and after every trip.</li>
<li><strong>Innovation</strong> — We embrace modern travel technologies and smarter travel solutions.</li>
<li><strong>Customer-Centricity</strong> — Our clients remain at the center of every decision.</li>
<li><strong>Safety</strong> — The wellbeing of travelers is our highest priority.</li>
<li><strong>Accountability</strong> — We take ownership of our commitments and deliver on our promises.</li>
</ul>

<h2>Why Choose Timeline Travel?</h2>
<p><strong>Dedicated Travel Expertise</strong> — Our experienced team manages every detail so clients can focus on what matters most.</p>
<p><strong>Cost Savings</strong> — We negotiate with global suppliers to secure competitive rates and maximize value.</p>
<p><strong>Time Efficiency</strong> — We reduce the administrative burden associated with travel planning and coordination.</p>
<p><strong>24/7 Support</strong> — Our travelers receive emergency travel assistance whenever they need it.</p>
<p><strong>Tailor-Made Solutions</strong> — Every organization and traveler has unique requirements. We build customized travel solutions accordingly.</p>
<p><strong>Technology Driven</strong> — We utilize travel tracking, reporting, and management tools that improve visibility and control.</p>

<h2>Our Promise</h2>
<ul>
<li>Professional Service</li>
<li>Transparent Communication</li>
<li>Competitive Pricing</li>
<li>Travel Compliance</li>
<li>Reliable Supplier Networks</li>
<li>Timely Responses</li>
<li>Personalized Attention</li>
<li>Safe Travel Experiences</li>
<li>End-to-End Support</li>
</ul>

<h2>What Makes Us Different?</h2>
<p>Many travel companies focus on bookings. Timeline Travel focuses on outcomes. We help organizations reduce travel administration, improve employee productivity, control travel spending, enhance traveler safety, improve reporting and accountability, and deliver better travel experiences. Our clients gain a strategic travel partner rather than simply a booking provider.</p>$page$
),
(
  'Booking Terms & Conditions',
  'booking-terms',
  'published',
  $page$<p>Timeline Travel — Reg: 2013/085216/07</p>

<h2>1. Undertaking</h2>
<p>Timeline Travel undertakes to provide all services offered subject to the terms and conditions set out herein, which terms and conditions are accepted by the passenger.</p>

<h2>2. Definition</h2>
<p><strong>Passenger</strong> means: individuals, groups, companies or other legal persons using the services offered by Timeline Travel, and includes the agents of passengers.</p>
<p><strong>Services</strong> means: the provision of accommodation and/or transportation and/or meals as offered by Timeline Travel and accepted by the passenger.</p>

<h2>3. Terms of Payment</h2>
<p>3.1 On confirmation of services, a deposit of 25% of the quoted tour price is required. (For tours that include the Blue Train and/or private game reserves and lodges, a different schedule of deposits, payments and cancellation fees applies — this will be provided when applicable.) Full payment plus rooming list is required 45 days before commencement of services.</p>
<p>Bookings made within 45 days of commencement of services must be accompanied by full payment of the tour plus rooming list. Where circumstances do not permit the timeous receipt of funds, explicit confirmation of transfer of funds will enable us to reserve services.</p>
<p>3.2 If payments are made in negotiable foreign currency, the payer is responsible for any short payment resulting from exchange rate fluctuations. The exchange rate applied by Timeline Travel's official bankers on receipt of monies will be accepted as the applicable rate.</p>
<p>3.3 If the required deposit or final payment is not received by the due date, Timeline Travel reserves the right to withdraw services.</p>

<h2>4. Cancellations</h2>
<p><strong>COVID-19 cancellation:</strong> If the passenger is precluded from traveling by pandemic-related travel restrictions in either South Africa or their country of origin, or a member of the traveling party contracts/tests positive for COVID-19 (confirmed by a doctor or positive test notification), a free postponement of up to 12 months or a full refund will apply. Proof (doctor's note, test result, government notice or similar) must be submitted to qualify.</p>
<p>4.1 Cancellations made more than 48 hours prior to arrival will not normally result in cancellation fees. Timeline Travel reserves the right to recover any costs incurred or charges received from suppliers up to the date of cancellation. Where services are cancelled 48 hours or less prior to arrival, the following cancellation fees apply:</p>
<ul>
<li>2 days before commencement of services: 25% of the total quoted tour price due.</li>
<li>1 day before commencement of services: 50% of the total quoted tour price due.</li>
<li>15 hours or less before commencement of services: 100% of the total quoted tour price due.</li>
</ul>
<p>We recommend that passengers take adequate personal cancellation insurance cover before departure from home.</p>
<p>4.2 For tours that include services from suppliers with more stringent policies (e.g. National Parks Board, Blue Train, private lodges and others), different cancellation fees will be enforceable and will be provided when applicable.</p>

<h2>5. Airlines</h2>
<p>In the event of cancellation or failure, for any reason, to use confirmed space as ticketed, 25% of the applicable airfare will be forfeited. A change of reservation constitutes a cancellation. Extension of ticket validity is not permitted, except where a passenger is hospitalised due to illness or in the event of death of an immediate family member. All airfare reservations are arranged subject to the conditions imposed by the respective airline.</p>

<h2>6. Luggage</h2>
<p>One suitcase and one overnight bag per person is allowed. Timeline Travel accepts no responsibility for loss or damage to luggage or personal property from whatsoever cause arising. Passengers are advised to take up adequate insurance cover.</p>

<h2>7. Responsibility</h2>
<p>Timeline Travel carries comprehensive passenger liability insurance, details of which will be made available on request. Timeline Travel is not responsible for any damages sustained by any passenger as a result of any act or omission whatsoever of any hotel, airline or other person, notwithstanding that Timeline Travel acted as agent of such hotel, airline or other person.</p>

<h2>8. Law</h2>
<p>The law of the Republic of South Africa shall govern the relationship between Timeline Travel and the passenger, and the courts of the Republic of South Africa shall have sole jurisdiction in respect of any claims and/or disputes which may arise between Timeline Travel and the passenger or agent.</p>$page$
);

-- ── POSTS  (doubles as "Travel Tips / Articles") ─────────────
CREATE TABLE public.posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  excerpt          TEXT,
  body             TEXT,
  body_json        JSONB,
  featured_image   TEXT,
  image_caption    TEXT,
  author_id        UUID REFERENCES public.profiles(id),
  category_id      UUID REFERENCES public.categories(id),
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','archived')),
  featured         BOOLEAN DEFAULT FALSE,
  -- Related tours (spec: "A Kruger article can display: View Kruger Tours")
  related_tour_ids UUID[] DEFAULT '{}',
  -- FAQ block (each of the 12 supplied articles ships with 3 Q&As;
  -- also feeds FAQPage schema per spec section 28)
  faq              JSONB DEFAULT '[]',
  seo_title        TEXT,
  meta_description TEXT,
  og_image         TEXT,
  canonical_url    TEXT,
  published_at     TIMESTAMPTZ,
  scheduled_at     TIMESTAMPTZ,
  read_time        INT DEFAULT 3,
  view_count       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON public.posts FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);
CREATE INDEX posts_search_idx ON public.posts USING GIN (to_tsvector('english', title || ' ' || COALESCE(excerpt,'') || ' ' || COALESCE(body,'')));
CREATE INDEX posts_status_idx ON public.posts (status);
CREATE INDEX posts_published_at_idx ON public.posts (published_at DESC);

CREATE TABLE public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view post tags" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Editors can manage post tags" ON public.post_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── DESTINATIONS ─────────────────────────────────────────────
CREATE TABLE public.destinations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  hero_image       TEXT,
  gallery          TEXT[] DEFAULT '{}',
  description      TEXT,
  things_to_do     JSONB DEFAULT '[]',
  travel_info      TEXT,
  faq              JSONB DEFAULT '[]',
  featured         BOOLEAN DEFAULT FALSE,
  published        BOOLEAN DEFAULT FALSE,
  seo_title        TEXT,
  meta_description TEXT,
  og_image         TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published destinations are public" ON public.destinations FOR SELECT USING (published = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage destinations" ON public.destinations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── SERVICES ─────────────────────────────────────────────────
CREATE TABLE public.services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  icon             TEXT,
  hero_image       TEXT,
  description      TEXT,
  content          TEXT,
  benefits         TEXT[] DEFAULT '{}',
  faq              JSONB DEFAULT '[]',
  display_order    INT DEFAULT 0,
  published        BOOLEAN DEFAULT FALSE,
  seo_title        TEXT,
  meta_description TEXT,
  og_image         TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published services are public" ON public.services FOR SELECT USING (published = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- Published by default — these 9 are structural nav items straight from
-- the client's own service list (profile doc + build spec), not draft
-- editorial content awaiting review.
INSERT INTO public.services (title, slug, display_order, published) VALUES
  ('Corporate Travel Management', 'corporate-travel', 1, true),
  ('Group Travel', 'group-travel', 2, true),
  ('Leisure Travel', 'leisure-travel', 3, true),
  ('Flights & Accommodation', 'flights-accommodation', 4, true),
  ('MICE / Events', 'mice-events', 5, true),
  ('Visa Assistance', 'visa-assistance', 6, true),
  ('Airport Transfers', 'airport-transfers', 7, true),
  ('Travel Insurance', 'travel-insurance', 8, true),
  ('Destination Management', 'destination-management', 9, true);

-- ── TOURS ────────────────────────────────────────────────────
-- Modelled on the 9 real packages supplied: these are flexible-date
-- private packages (customer requests their own travel dates,
-- subject to the deposit/lead-time terms in booking-terms), not
-- fixed monthly group departures — so there is deliberately no
-- rigid "departure_dates" table here. starts_in/ends_in capture the
-- route as free text (e.g. "Johannesburg – Kruger & Cape Town")
-- exactly as supplied, rather than forcing them into destination FKs.
CREATE TABLE public.tours (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  tour_code         TEXT,
  destination_id    UUID REFERENCES public.destinations(id),
  starts_in         TEXT,
  ends_in           TEXT,
  style             TEXT,
  operator          TEXT DEFAULT 'Timeline Travel DMC',
  duration_days     INT NOT NULL,
  min_pax           INT DEFAULT 1,
  ideal_age_min     INT,
  ideal_age_max     INT,
  introduction      TEXT,
  featured_image    TEXT,
  gallery           TEXT[] DEFAULT '{}',
  included          TEXT[] DEFAULT '{}',
  excluded          TEXT[] DEFAULT '{}',
  faq               JSONB DEFAULT '[]',
  featured          BOOLEAN DEFAULT FALSE,
  published         BOOLEAN DEFAULT FALSE,
  seo_title         TEXT,
  meta_description  TEXT,
  og_image          TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published tours are public" ON public.tours FOR SELECT USING (published = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage tours" ON public.tours FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);
CREATE INDEX tours_published_idx ON public.tours (published);
CREATE INDEX tours_featured_idx ON public.tours (featured);

-- Price tiers — several supplied tours offer e.g. Luxury vs Standard
-- hotel options, each with its own per-person price and single
-- supplement, rather than one flat price per tour.
CREATE TABLE public.tour_price_tiers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id           UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  tier_name         TEXT NOT NULL,          -- e.g. 'Standard', 'Luxury'
  hotel_description TEXT,                    -- e.g. '5-Star Radisson Blu Sandton'
  price_per_person  NUMERIC(10,2) NOT NULL,
  single_supplement NUMERIC(10,2),
  currency          TEXT NOT NULL DEFAULT 'ZAR',
  display_order     INT DEFAULT 0
);
ALTER TABLE public.tour_price_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view price tiers" ON public.tour_price_tiers FOR SELECT USING (true);
CREATE POLICY "Editors can manage price tiers" ON public.tour_price_tiers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- Day-by-day itinerary
CREATE TABLE public.tour_itinerary_days (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id           UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  day_number        INT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  main_destination  TEXT,
  accommodation     TEXT,
  meals             TEXT,
  UNIQUE (tour_id, day_number)
);
ALTER TABLE public.tour_itinerary_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view itinerary days" ON public.tour_itinerary_days FOR SELECT USING (true);
CREATE POLICY "Editors can manage itinerary days" ON public.tour_itinerary_days FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── BOOKINGS ─────────────────────────────────────────────────
-- Booking creation, payment initiation, payment verification and
-- booking confirmation are kept as separate states (spec section 37)
-- so a failed/abandoned payment never reads as a confirmed booking.
-- payment_status is only ever flipped to 'paid' by the server-side
-- Paystack webhook/verify step — never by the client.
CREATE TABLE public.bookings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference   TEXT UNIQUE NOT NULL,
  tour_id             UUID NOT NULL REFERENCES public.tours(id),
  price_tier_id       UUID REFERENCES public.tour_price_tiers(id),
  travel_start_date   DATE,
  travellers_count    INT NOT NULL DEFAULT 1,
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  special_requirements TEXT,
  notes               TEXT,
  amount              NUMERIC(10,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'ZAR',
  payment_reference   TEXT UNIQUE, -- PayFast's pf_payment_id, set once the ITN confirms payment
  payment_status      TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
  booking_status      TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending','confirmed','cancelled')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at        TIMESTAMPTZ
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);
CREATE INDEX bookings_status_idx ON public.bookings (booking_status);
CREATE INDEX bookings_created_at_idx ON public.bookings (created_at DESC);

-- ── TRIP REQUESTS ("Plan My Trip" — an enquiry, not a booking) ─
CREATE TABLE public.trip_requests (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name             TEXT NOT NULL,
  customer_email            TEXT NOT NULL,
  customer_phone            TEXT NOT NULL,
  destination               TEXT,
  preferred_dates           TEXT,
  travellers_count          INT,
  travel_type               TEXT,
  budget_range              TEXT,
  accommodation_requirements TEXT,
  transport_requirements    TEXT,
  special_requests          TEXT,
  notes                     TEXT,
  status                    TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trip_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view trip requests" ON public.trip_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);
CREATE INDEX trip_requests_status_idx ON public.trip_requests (status);

-- ── CONTACT MESSAGES (general contact form) ──────────────────
CREATE TABLE public.contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── NEWSLETTER SUBSCRIBERS (email capture) ───────────────────
CREATE TABLE public.newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','unsubscribed','bounced')),
  segment         TEXT DEFAULT 'general',
  source          TEXT DEFAULT 'website',
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view subscribers" ON public.newsletter_subscribers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);

-- ── SITE SETTINGS (key/value — admin-editable, never hardcoded) ─
-- Closes a gap the Insights codebase audit flagged: site_settings is
-- referenced in code (lib/settings.ts) but was never committed as a
-- migration anywhere. Given a fresh start here, it's done properly.
CREATE TABLE public.site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);

-- Seed the settings the spec explicitly requires to be admin-editable
-- rather than hardcoded. URLs are left blank — per spec section 39,
-- never invent social profile URLs; Andrew fills these in once real.
INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp_number', '+27714759998'),
  ('whatsapp_message', 'Hello Timeline Travel, I would like assistance with planning my trip.'),
  ('social_facebook', 'https://facebook.com/timelinetravelagency'),
  ('social_instagram', 'https://instagram.com/timeline_travel'),
  ('social_x', 'https://x.com/timelinetravelsa'),
  ('social_youtube', ''),
  ('social_linkedin', ''),
  ('contact_phone', '+27 71 475 9998'),
  ('contact_email', 'andrew@timelinetravel.co.za'),
  ('contact_address', 'Ground Floor, Mac Mac Building, Maxwell Office Park, Waterfall City, Johannesburg'),
  ('meta_default_title', 'Timeline Travel — Travel Beyond Destinations'),
  ('meta_default_description', 'Professional travel management and destination experiences across Africa and beyond.'),
  ('meta_default_og_image', '');

-- ── AUTO-UPDATE updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_pages_updated BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_destinations_updated BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tours_updated BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
