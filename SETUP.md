# Chesly CMS — Setup Guide

## 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** → paste the entire contents of `supabase-schema.sql` → Run
3. Go to **Authentication → Settings**:
   - Enable Email/Password sign-in
   - Add `http://localhost:3000` and your production domain to Redirect URLs
4. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Create Admin User
In Supabase Dashboard → **Authentication → Users → Add User**
Enter your email + password. Then in **Table Editor → profiles**, set your `role` to `super_admin`.

## 3. Environment Variables
Copy `.env.local` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/mkvu8hdr5
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=make-up-a-random-string-here
```

## 4. Run Locally
```bash
npm install
npm run dev
# Open http://localhost:3000 → redirects to /login
```

## 5. Deploy to Vercel
```bash
npm i -g vercel
vercel
```
Add all `.env.local` values as Vercel environment variables.

## 6. Auto-Publish Scheduled Posts
Add a Vercel Cron Job in `vercel.json`:
```json
{
  "crons": [{ "path": "/api/cron/publish", "schedule": "*/5 * * * *" }]
}
```
Set `CRON_SECRET` in Vercel env vars and pass it as `Authorization: Bearer YOUR_SECRET` header.

## 7. Connect Insights Website
The public API is live at:
- `GET /api/public/posts` — all published posts
- `GET /api/public/posts/[slug]` — single post by slug

Update your Insights website's `siteConfig.ts` or data-fetching layer to pull from:
```
https://your-cms-domain.vercel.app/api/public/posts
```
