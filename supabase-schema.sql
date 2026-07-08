-- ============================================================
-- CHESLY CMS — SUPABASE SCHEMA
-- Run this in your Supabase SQL editor (Project > SQL Editor)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

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

-- ── CATEGORIES ───────────────────────────────────────────────
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  color       TEXT DEFAULT '#8B6914',
  icon        TEXT DEFAULT '📁',
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

-- Seed categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Artificial Intelligence', 'ai', 'AI tools, prompts, and strategies', '🤖', '#1B2A4A'),
  ('SEO & GEO', 'seo', 'Search and AI engine optimisation', '🔍', '#8B6914'),
  ('Technology', 'technology', 'Tech trends and tools', '💻', '#1B2A4A'),
  ('Digital Marketing', 'digital-marketing', 'Growth and marketing strategies', '📣', '#8B6914'),
  ('South Africa', 'south-africa', 'SA-focused business content', '🇿🇦', '#1B2A4A'),
  ('Startups', 'startups', 'Startup ideas and stories', '🚀', '#8B6914'),
  ('Business', 'business', 'Business growth and strategy', '📈', '#1B2A4A'),
  ('Spaza Shop', 'spaza-shop', 'Township economy and informal business', '🏪', '#8B6914'),
  ('Guides', 'guides', 'Step-by-step how-to guides', '📖', '#1B2A4A');

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

-- ── POSTS ────────────────────────────────────────────────────
CREATE TABLE public.posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  excerpt          TEXT,
  body             TEXT,    -- HTML from TipTap
  body_json        JSONB,   -- TipTap JSON (for re-editing)
  featured_image   TEXT,    -- ImageKit URL
  image_caption    TEXT,
  author_id        UUID REFERENCES public.profiles(id),
  category_id      UUID REFERENCES public.categories(id),
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','archived')),
  featured         BOOLEAN DEFAULT FALSE,
  trending         BOOLEAN DEFAULT FALSE,
  popular          BOOLEAN DEFAULT FALSE,
  -- SEO fields
  seo_title        TEXT,
  meta_description TEXT,
  og_image         TEXT,
  canonical_url    TEXT,
  -- Scheduling
  published_at     TIMESTAMPTZ,
  scheduled_at     TIMESTAMPTZ,
  -- Read time
  read_time        INT DEFAULT 3,
  -- Engagement
  view_count       INT DEFAULT 0,
  -- Timestamps
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON public.posts FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage own posts" ON public.posts FOR ALL USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);
-- Full-text search index
CREATE INDEX posts_search_idx ON public.posts USING GIN (to_tsvector('english', title || ' ' || COALESCE(excerpt,'') || ' ' || COALESCE(body,'')));
CREATE INDEX posts_status_idx ON public.posts (status);
CREATE INDEX posts_published_at_idx ON public.posts (published_at DESC);

-- ── POST TAGS (junction) ─────────────────────────────────────
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

-- ── DOWNLOADS ────────────────────────────────────────────────
CREATE TABLE public.downloads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  file_url      TEXT NOT NULL,
  file_type     TEXT CHECK (file_type IN ('pdf','zip','doc','other')),
  category_id   UUID REFERENCES public.categories(id),
  is_premium    BOOLEAN DEFAULT FALSE,
  is_published  BOOLEAN DEFAULT FALSE,
  download_count INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public downloads visible" ON public.downloads FOR SELECT USING (is_published = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage downloads" ON public.downloads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
);

-- ── NEWSLETTER SUBSCRIBERS ───────────────────────────────────
CREATE TABLE public.newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active','unsubscribed','bounced')),
  segment       TEXT DEFAULT 'general',
  source        TEXT DEFAULT 'website',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view subscribers" ON public.newsletter_subscribers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
);

-- ── PAGES ────────────────────────────────────────────────────
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

-- ── AUTO-UPDATE updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_downloads_updated BEFORE UPDATE ON public.downloads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_pages_updated BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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

-- ── SCHEDULE: auto-publish posts ─────────────────────────────
-- Run via Supabase cron (pg_cron) or a Vercel cron job hitting /api/cron/publish
-- UPDATE public.posts SET status = 'published', published_at = NOW()
-- WHERE status = 'scheduled' AND scheduled_at <= NOW();
