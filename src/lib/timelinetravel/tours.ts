import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export type TourPriceTier = {
  id: string;
  tierName: string;
  hotelDescription: string | null;
  pricePerPerson: number;
  singleSupplement: number | null;
  currency: string;
};

export type TourItineraryDay = {
  dayNumber: number;
  title: string;
  description: string | null;
  mainDestination: string | null;
  accommodation: string | null;
  meals: string | null;
};

export type Tour = {
  id: string;
  title: string;
  slug: string;
  tourCode: string | null;
  startsIn: string | null;
  endsIn: string | null;
  style: string | null;
  operator: string;
  durationDays: number;
  minPax: number;
  idealAgeMin: number | null;
  idealAgeMax: number | null;
  introduction: string | null;
  featuredImage: string | null;
  gallery: string[];
  included: string[];
  excluded: string[];
  faq: { question: string; answer: string }[];
  featured: boolean;
  priceTiers: TourPriceTier[];
  itinerary: TourItineraryDay[];
  // Convenience: the cheapest tier's price, for "From RX,XXX" card copy.
  fromPrice: number | null;
  fromCurrency: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTour(row: any): Tour {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const priceTiers: TourPriceTier[] = (row.tour_price_tiers || []).map((t: any) => ({
    id: t.id,
    tierName: t.tier_name,
    hotelDescription: t.hotel_description,
    pricePerPerson: Number(t.price_per_person),
    singleSupplement: t.single_supplement != null ? Number(t.single_supplement) : null,
    currency: t.currency,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itinerary: TourItineraryDay[] = (row.tour_itinerary_days || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((d: any) => ({
      dayNumber: d.day_number,
      title: d.title,
      description: d.description,
      mainDestination: d.main_destination,
      accommodation: d.accommodation,
      meals: d.meals,
    }))
    .sort((a: TourItineraryDay, b: TourItineraryDay) => a.dayNumber - b.dayNumber);

  const cheapest = priceTiers.reduce<TourPriceTier | null>(
    (min, t) => (min === null || t.pricePerPerson < min.pricePerPerson ? t : min),
    null
  );

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    tourCode: row.tour_code,
    startsIn: row.starts_in,
    endsIn: row.ends_in,
    style: row.style,
    operator: row.operator,
    durationDays: row.duration_days,
    minPax: row.min_pax,
    idealAgeMin: row.ideal_age_min,
    idealAgeMax: row.ideal_age_max,
    introduction: row.introduction,
    featuredImage: row.featured_image,
    gallery: row.gallery || [],
    included: row.included || [],
    excluded: row.excluded || [],
    faq: row.faq || [],
    featured: !!row.featured,
    priceTiers,
    itinerary,
    fromPrice: cheapest?.pricePerPerson ?? null,
    fromCurrency: cheapest?.currency ?? "ZAR",
  };
}

const TOUR_SELECT = "*, tour_price_tiers(*), tour_itinerary_days(*)";

export const getAllTours = cache(async (): Promise<Tour[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tours")
    .select(TOUR_SELECT)
    .eq("published", true)
    .order("duration_days");
  if (error || !data) return [];
  return data.map(rowToTour);
});

export const getFeaturedTours = cache(async (): Promise<Tour[]> => {
  const all = await getAllTours();
  const featured = all.filter((t) => t.featured);
  return featured.length > 0 ? featured : all.slice(0, 4);
});

export const getTourBySlug = cache(async (slug: string): Promise<Tour | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tours")
    .select(TOUR_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return rowToTour(data);
});
