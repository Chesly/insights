# Calculators — Backlog (for next Claude session)

Status as of 2 Sep 2026: calculators now have a main-nav link, a home-page
teaser section (below "Business Tools", registry in `src/lib/calculators.ts`),
and card icons are ready to take real artwork instead of emoji — see
"Icon images" below.

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
