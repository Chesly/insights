# Calculators — Backlog (for next Claude session)

Status as of 3 Sep 2026: calculators now have a main-nav link, a home-page
teaser section (below "Business Tools", registry in `src/lib/calculators.ts`),
and card icons are ready to take real artwork instead of emoji — see
"Icon images" below.

## ACTION NEEDED — run the new migration before the email feature works

3 Sep 2026 session fixed the "extra zeros" bug reported on the tender
calculator's number inputs (controlled `type="number"` fields defaulting to
`0` — typing into them without clearing first inserted into the existing
"0" instead of replacing it; fixed on all three calculators by selecting
the field's contents on focus, in `TenderCalculator.tsx`,
`VatCalculator.tsx`, `RetentionCalculator.tsx`).

It also added an **optional** "Email me these results" form to the tender
calculator (`TenderCalculator.tsx`) — results are never gated behind it,
it's purely an opt-in offer at the end, same consent pattern as the free
digital-download form (name, email, separate "send me tips" checkbox).
Backend: `src/app/api/public/calculators/[slug]/results/route.ts` writes
the submission to a new `calculator_leads` table and emails the visitor a
copy via the existing Resend `sendEmail()` helper.

**This table doesn't exist yet.** Run `supabase-migration-5-calculator-leads.sql`
in the Supabase SQL editor (same manual step as the other
`supabase-migration-N.sql` files) before testing/shipping this — until
then the form will save nothing and show an error. Also confirm
`RESEND_API_KEY` is set in production (it should already be, since
order/contact emails depend on it too).

The email is a formatted HTML summary of the results (tender details,
score, strengths/risks, full pricing table, decision) — not a literal PDF
attachment, to keep this in scope for the credits available this session.
A follow-up could generate a real PDF (e.g. via a headless-render step) and
attach it instead, if Chesly wants that specifically.

## Also next — apply the same patterns to the other calculators

Chesly wants every calculator (not just tender bid/no-bid) to:
1. Have the same optional "email me my results" form — extend the pattern
   above to `VatCalculator.tsx` and `RetentionCalculator.tsx`. The API
   route is already slug-generic (`/api/public/calculators/[slug]/results`)
   — a `calculatorTitle`/`summaryLines`/`sections` payload from any
   calculator will work as-is, just add the same UI block + payload
   builder to each component.
2. Show a "suggested products" block — **already done** site-wide via
   `ProductsTeaser` at the bottom of every calculator page, nothing further
   needed here.
3. Eventually surface the in-progress "Tender Operating System" product
   (a separate, bigger product Chesly is building — not the existing
   "South African Tender Toolkit" spreadsheet already upsold on the tender
   page) as a suggestion on the tender calculator specifically, once it's
   ready to expose publicly. Don't build/link it yet — Chesly was explicit
   he doesn't want it exposed while still in development.
4. Chesly also mentioned "Prime Media" as the next thing to work on after
   this calculator — unclear from context whether that's another
   calculator, a client project, or something else. Confirm with him
   before starting it.

## PRIORITY for next week — 4th calculator

Chesly wants at least **4 calculators live** (currently 3: tender bid/no-bid,
VAT, retention). Build the next one first thing next session. It's plain
HTML/JS (like the others), so it's deliberately being deferred to a session
on a separate account to avoid burning this week's usage — treat it as the
top priority item when that session starts.

To add it once the topic/spec is confirmed with Chesly:
1. Build the calculator component in `src/components/` (mirror
   `VatCalculator.tsx` / `TenderCalculator.tsx` / `RetentionCalculator.tsx`
   — client-side only, nothing uploaded).
2. Add its page at `src/app/calculators/<slug>/page.tsx` (mirror an
   existing one, including `ProductsTeaser` at the bottom).
3. Register it in `CALCULATORS` in `src/lib/calculators.ts` — the hub page,
   sitemap, and home-page teaser all read from that list automatically.

## Icon images

Chesly is producing custom square icon artwork for each calculator (to
match the image-forward look used elsewhere on the site, e.g. Business
Tools product cards) rather than the current emoji icons.

`CalculatorMeta` in `src/lib/calculators.ts` already has an optional
`image?: string` field for this — both the `/calculators` hub grid and the
home-page `CalculatorsTeaser` prefer `image` over the emoji `icon` when
it's set. So once Chesly supplies the images (upload them somewhere
hostable, e.g. the same ImageKit account used for `thumbnailUrl` on
downloads), the only change needed is filling in `image: "<url>"` on each
entry in `CALCULATORS` — no component changes required.
