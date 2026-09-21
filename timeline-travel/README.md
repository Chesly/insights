# Timeline Travel

Standalone Next.js site for Timeline Travel (South African travel/DMC).

This is a **fully independent project**, not a module of Insights. It lives in
this folder only because it shares a GitHub account with Insights — there is
no code-sharing, no shared `node_modules`, no shared routing, and no runtime
dependency between the two. It has its own `package.json`, its own Supabase
project, its own Vercel deployment (with this folder set as the project's
Root Directory), and can be copied out into its own repository at any time
with zero untangling.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + Auth) — its own project, separate from Insights'
- PayFast — tour booking payments (signed form POST + server-side ITN
  verification, see `src/lib/payfast.ts`)
- Resend — booking confirmation and contact-form emails

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase/PayFast/Resend credentials
npm run dev
```

Run `supabase-schema.sql` against a fresh Supabase project before first use.

## Booking/payment flow

Booking creation, payment initiation, and payment verification are three
separate steps by design (see `src/app/api/bookings`, `src/app/api/checkout`,
`src/app/api/webhooks/payfast`). A booking is only ever marked paid by the
PayFast webhook after its signature, server-to-server validation, and amount
all check out — never by the frontend redirect.
