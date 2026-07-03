# Chesly.Tech Insights

An AI-first technology publication covering AI, startups, SEO/GEO, web design, and
South African business — built with Next.js 16, TypeScript, and MDX, and optimized
for both traditional search (Google, Bing) and AI answer engines (Google AI
Overviews, ChatGPT Search, Perplexity, Gemini, Claude).

Owned and published by **Chesly Silaule** ([chesly.tech](https://chesly.tech)).

## Tech stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + `@tailwindcss/typography`
- **Content:** MDX files in `content/posts`, parsed with `gray-matter`
- **OG images:** generated at build time with `next/og`
- **Analytics:** GA4, Google Tag Manager, Microsoft Clarity (all opt-in via env vars)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in only what you have — every var is optional
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
app/                    Routes (App Router)
  blog/[slug]/           Article pages + per-article OG image
  category/[slug]/       Category archive pages
  tag/[slug]/             Tag archive pages
  author/[slug]/          Author profile pages
  search/                 Search results page
  api/search/             Search API route
  sitemap.ts, robots.ts   Dynamic SEO files
  rss.xml/route.ts        RSS feed
content/posts/           MDX articles (frontmatter + body)
lib/                     Data access, schema builders, config, search
components/               Header, Footer, SearchBar, Analytics, GTM
public/                   llms.txt, humans.txt, ads.txt, security.txt
```

## Writing an article

Add a `.mdx` file to `content/posts/`. Minimum required frontmatter:

```yaml
---
title: "Article Title"
description: "One or two sentences for meta description and cards."
category: "AI"
tags: ["tag one", "tag two"]
author: "Chesly Silaule"
image: "https://chesly.tech/insights/images/chesly.tech_logo.png"
publishedDate: "2026-07-03"
modifiedDate: "2026-07-03"
keywords: ["keyword one", "keyword two"]
draft: false
---
```

Optional fields for AI-search optimization (all safe to omit): `aiSummary`,
`keyTakeaways`, `faq`, `definitions`, `expertInsight`, `comparisonTable`, `pros`,
`cons`, `relatedTopics`, `suggestedQuestions`, `semanticKeywords`, `howToSteps`,
`featured`, `editorsPick`, `trending`, `authorSlug`. See `lib/types.ts` for the
full shape and any existing post in `content/posts/` for a worked example.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Documentation

- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — how to deploy on Vercel, Domains.co.za cPanel, and locally
- [`CHECKLIST.md`](./CHECKLIST.md) — pre-launch checklist

## License

Private and proprietary. © Chesly Silaule / Chesly.Tech. All rights reserved.
