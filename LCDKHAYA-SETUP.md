# LCD Khaya Driving School — Setup & Handoff Notes

The site lives inside this repo at `/lcdkhaya/*` (e.g. `insights.chesly.tech/lcdkhaya`),
reusing the Insights CMS backend (blog, "Did You Know" facts, newsletter, Paystack
checkout, admin login) rather than duplicating it — see `src/lib/lcdkhaya/config.ts`
for all branding/copy in one place.

## What's built

- **Pages**: Home, About, Services & Packages, Booking (with Paystack), Blog,
  Did You Know?, Gallery, Contact, Terms, Privacy.
- **Blog**: reuses the existing Insights blog/admin — tag any post `lcdkhaya` in
  the admin panel and it appears at `/lcdkhaya/blog` automatically (same pattern
  as the existing `/spaza-support` page).
- **Did You Know?**: reuses the existing facts admin — set a fact's category to
  `Driving` and it appears at `/lcdkhaya/facts`.
- **Newsletter**: posts to the same `/api/newsletter` as Insights, tagged with
  source `lcdkhaya` so subscribers are distinguishable in the admin panel.
- **Booking & payments**: `/lcdkhaya/booking` → `/api/lcdkhaya/booking` → Paystack
  (same `PAYSTACK_SECRET_KEY` env var Insights already uses) → confirmation
  email. Bookings are stored in a new `lcdkhaya_bookings` table (run
  `supabase-migration-3-lcdkhaya.sql` in Supabase SQL Editor) rather than the
  `orders` table, since that table's fulfillment mints digital-download tokens,
  which doesn't apply to a driving lesson.
- **Domain**: `lcdkhaya.co.za` is wired into `src/middleware.ts` — once DNS
  points the domain at this Vercel project (and the domain is added in Vercel's
  project settings), requests to `lcdkhaya.co.za/*` are rewritten to `/lcdkhaya/*`
  automatically, so the public URL is clean (`lcdkhaya.co.za/services`, not
  `/lcdkhaya/services`).
- **Image placeholders**: every photo slot uses a consistent gold/bronze duotone
  placeholder (`src/components/lcdkhaya/PlaceholderImage.tsx`) instead of stock
  photos, so the site looks like one deliberate design rather than a mismatched
  placeholder grab-bag until real photography is ready.

## What you still need to supply

1. **Pricing** for each package in `src/lib/lcdkhaya/config.ts` (`packages[].price`,
   currently `null` → the site shows "Contact us for pricing" and routes bookings
   as leads to quote manually instead of charging through Paystack). Once you send
   real prices, I'll wire them in.
2. **Real contact details** — phone, WhatsApp number, and email are placeholders
   in `config.ts` (`contact.phone`, `contact.whatsapp`, `contact.email`).
3. **Logo** — once uploaded to ImageKit, swap `branding.logo` in `config.ts` for
   the real URL (same pattern as `siteConfig.branding.logoHeader` for Insights).
4. **Real photos** — see prompts below. Once generated, swap them in for the
   `PlaceholderImage` components (they're all in `src/app/lcdkhaya/**` and
   `src/components/lcdkhaya/`).
5. **Domain DNS** — point `lcdkhaya.co.za` at this Vercel project once registered,
   and add it under the project's domain settings.
6. **Testimonials** — `config.ts`'s `testimonials` array is intentionally empty;
   only add real, permissioned reviews there (the site shows a "coming soon"
   state until then rather than fabricated quotes).
7. **Contact form destination** — LCD Khaya's contact form currently notifies
   whatever email is set in Insights' Admin → Settings → `contact_email` (shared
   with the main Insights site). Let me know if you want a dedicated inbox for
   LCD Khaya enquiries instead.

## AI image-generation prompts

Use these with your preferred image generator once you're home. They all lean
into the gold/bronze/charcoal palette from the logo so real photos will sit
naturally alongside the site's existing accents.

1. **Hero (home page)** — "A confident Black South African driving instructor
   in the passenger seat of a modern sedan, coaching a young adult learner
   driver at the wheel, warm golden-hour light through the windscreen, Daveyton/
   Benoni township street visible outside, professional photography, warm gold
   and bronze color grading, shallow depth of field."
2. **About page** — "Portrait of a friendly, professional Black South African
   driving instructor standing beside a branded driving-school car, arms
   crossed, warm confident smile, East Rand Gauteng suburban street background,
   natural daylight, warm gold-toned color grading."
3. **Services — Code 8** — "Interior view over the shoulder of a learner driver
   gripping the steering wheel of a car, K53 test yard with cones visible
   through the windscreen, daytime, warm tones."
4. **Services — Code 10/14** — "A heavy-duty truck or light rigid vehicle
   parked in a driving-school training yard, South African road markings and
   traffic cones, wide shot, golden hour lighting."
5. **Gallery — instructor & learner** — "A driving instructor pointing out a
   road sign to a learner driver through the car window, both smiling, suburban
   Benoni street, candid documentary photography style, warm color grading."
6. **Gallery — K53 test routes** — "A quiet suburban East Rand street with
   clear K53-style road markings, stop sign and yield sign visible, morning
   light, no people, warm gold color grading."
7. **Gallery — driving school car exterior** — "A clean, modern sedan with
   detachable dual-control driving school signage on the roof, parked outside a
   modest Daveyton home, warm afternoon light."

Keep prompts consistent on: warm gold/bronze color grading, East Rand/township
setting (not generic stock-photo suburbia), and genuine, non-stereotypical
representation of local instructors and learners.
