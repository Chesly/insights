import { createServiceClient } from "@/lib/supabase/service";

export type BookingWithTour = {
  id: string;
  bookingReference: string;
  tourTitle: string;
  tourSlug: string;
  travelStartDate: string | null;
  travellersCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  bookingStatus: string;
};

// Server-only lookup (service-role client, never exposed to the browser)
// — mirrors src/lib/invoice.ts's getOrderByReference. The booking
// reference itself is the access token here, same as an invoice number;
// there's no public RLS policy on `bookings` and there shouldn't be one.
export async function getBookingByReference(reference: string): Promise<BookingWithTour | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, tours(title, slug)")
    .eq("booking_reference", reference)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    bookingReference: data.booking_reference,
    tourTitle: data.tours?.title || "Timeline Travel Tour",
    tourSlug: data.tours?.slug || "",
    travelStartDate: data.travel_start_date,
    travellersCount: data.travellers_count,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    amount: Number(data.amount),
    currency: data.currency,
    paymentStatus: data.payment_status,
    bookingStatus: data.booking_status,
  };
}
