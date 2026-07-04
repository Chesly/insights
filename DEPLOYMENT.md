# Deployment Guide

This project builds to two things you can deploy:

1. A **standard Next.js app** (`next build` → `next start`) — the easiest path, and
   what Vercel uses automatically.
2. A **standalone Node.js bundle** (`.next/standalone/`) — a self-contained server
   with only the files it needs, built via the `output: "standalone"` setting in
   `next.config.mjs`. This is what you'll use on cPanel/shared Node hosting.

Both are produced by the same `npm run build` — you just choose which output you run.

---

## Option A — Vercel (recommended, least effort)

Vercel is built by the Next.js team and needs zero configuration for this project.

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset: Vercel auto-detects **Next.js**. Leave build/output settings
   as default (`npm run build`, no output directory override needed — Vercel
   ignores the `standalone` setting and uses its own optimized runtime).
4. Add environment variables under **Project → Settings → Environment Variables**
   (see [Environment Variables](#environment-variables) below). All are optional;
   add only the ones you have.
5. Click **Deploy**. Every push to your main branch redeploys automatically.
6. Once live, go to **Project → Settings → Domains** and add `chesly.tech` (or
   whichever domain/subdomain you're using) and follow Vercel's DNS instructions
   (usually an `A` record to `76.76.21.21` or a `CNAME` to `cname.vercel-dns.com`).

**Note on the site's base path:** `lib/siteConfig.ts` sets `siteConfig.url` to
`https://chesly.tech/insights`. If you deploy this as its own Vercel project on
its own domain/subdomain (e.g. `insights.chesly.tech`), update `siteConfig.url`
to match exactly — canonical URLs, sitemap, RSS, and OG images all derive from
this one value. If you instead need it reachable at a **path** on your existing
site (`chesly.tech/insights`), see [A note on sub-path deployments](#a-note-on-sub-path-deployments) below.

---

## Option B — Domains.co.za cPanel (Node.js)

Domains.co.za's cPanel includes the standard **"Setup Node.js App"** tool
(CloudLinux Node.js Selector / Passenger), the same interface used by most South
African cPanel hosts. Confirm your plan includes Node.js hosting before starting
— some entry-level shared plans are PHP-only.

### 1. Build locally first

On your own machine (not on the server):

```bash
npm install
npm run build
```

This produces `.next/standalone/`. That folder — plus two things it does **not**
include automatically — is what you'll upload.

### 2. Assemble the upload folder

```bash
mkdir deploy
cp -r .next/standalone/* deploy/
cp -r .next/static deploy/.next/static
cp -r public deploy/public
```

Your `deploy/` folder should now contain `server.js`, `node_modules`,
`package.json`, `content/`, `.next/` (with `static/` inside it), and `public/`.

### 3. Create the Node.js app in cPanel

1. Log into cPanel → **Software** → **Setup Node.js App** → **Create Application**.
2. **Node.js version:** 20.x or 22.x (Next.js 16 requires Node 20.9+; Vercel's default is Node 24).
3. **Application mode:** Production.
4. **Application root:** e.g. `chesly-insights` (cPanel creates this under your
   home directory).
5. **Application URL:** the domain or subdomain this should serve
   (e.g. `insights.chesly.tech`, or a subdirectory — see the note below).
6. **Application startup file:** `server.js`.
7. Click **Create**.

### 4. Upload your files

Via cPanel **File Manager** (or SFTP), upload the entire contents of your local
`deploy/` folder into the **Application root** directory cPanel just created.

### 5. Install & configure

Back in **Setup Node.js App**, open your application and:

- Click **Run NPM Install** (this reconciles native bindings for this server;
  safe to run even though `node_modules` was uploaded).
- Under **Environment Variables**, add the ones you're using (see below) —
  plus these two, which cPanel/Passenger requires explicitly for Next.js
  standalone mode:
  - `HOSTNAME` = `0.0.0.0`
  - `NODE_ENV` = `production`
- Click **Save**, then **Restart**.

### 6. Verify

Open the Application URL. You should see the homepage render. Check
`stderr.log` / `stdout.log` in the application root if something doesn't load —
almost all issues at this stage are a missing environment variable or the
`.next/static` / `public` copy step being skipped.

### A note on sub-path deployments

If this needs to live at `chesly.tech/insights` (a path on your **existing**
site) rather than its own domain/subdomain, that's a reverse-proxy setup, not
something the Node.js Selector does natively. The cleaner options, in order of
preference:

1. **Use a subdomain instead** (`insights.chesly.tech`) — zero extra config,
   works with everything in this repo as-is. Recommended.
2. **Reverse-proxy a subpath to the Node app** — requires editing the domain's
   Apache/Nginx config to proxy `/insights/*` to the internal port Passenger
   assigns your app, which isn't exposed through the standard cPanel UI. Ask
   Domains.co.za support whether they support custom proxy rules on your plan.
3. **Set Next's `basePath`** — if you go with option 2, add
   `basePath: "/insights"` to `next.config.mjs` so all internal links, the
   sitemap, and static assets are correctly prefixed, then rebuild.

Whichever you choose, keep `siteConfig.url` in `lib/siteConfig.ts` matching the
final public URL exactly — everything SEO-related (canonical tags, sitemap,
RSS, OG images, JSON-LD) is derived from it.

---

## Option C — Local development

```bash
npm install
cp .env.example .env.local     # optional — fill in only what you have
npm run dev
```

Visit `http://localhost:3000`. Hot reload is automatic.

To test the exact production build locally before deploying anywhere:

```bash
npm run build
npm start
```

To test the standalone bundle exactly as cPanel will run it:

```bash
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cd .next/standalone
PORT=3000 node server.js
```

---

## Environment Variables

All variables are **optional** — every feature they control is simply skipped
when its variable is unset, so the site works correctly with none of them
configured. Copy `.env.example` to `.env.local` for local dev, or set them in
your host's dashboard for production.

| Variable | Used for | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 | GA Admin → Data Streams → your stream (`G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager | GTM → your container (`GTM-XXXXXXX`) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity | clarity.microsoft.com → Settings → Setup |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag verification | Search Console → Settings → Ownership verification → HTML tag → the `content` value only |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools verification | Bing Webmaster Tools → Settings → the `content` value only |

Note: all of these are prefixed `NEXT_PUBLIC_` because they're read in
client-rendered or statically-embedded metadata — they are not secret values
(GA/GTM/Clarity IDs and verification tokens are visible in any page's HTML
source regardless). Do not put real secrets (API keys, passwords) in
`NEXT_PUBLIC_` variables.

---

## Post-deploy sanity checks

After any deployment, confirm:

```
curl -I https://your-domain/                 → 200
curl https://your-domain/sitemap.xml          → valid XML, real URLs
curl https://your-domain/robots.txt           → Allow rules + Sitemap: line
curl https://your-domain/rss.xml              → valid RSS
curl https://your-domain/blog/<any-slug>      → 200, view-source has JSON-LD
curl https://your-domain/does-not-exist       → 404 (branded not-found page)
```

See `CHECKLIST.md` for the full pre-launch checklist.
