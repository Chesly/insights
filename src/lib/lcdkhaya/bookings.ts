import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email";
import { lcdKhayaConfig } from "./config";

export interface BookingInput {
  packageId: string;
  packageName: string;
  /** Rand amount — may be 0 while pricing is still TBD (see config.ts);
      a zero-amount booking skips Paystack and is recorded as a lead for
      LCD Khaya to follow up on and quote manually. */
  packagePrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredArea: string;
  preferredDate: string | null;
  notes: string | null;
  newsletterOptIn: boolean;
}

// Bookings are kept in their own table rather than reusing `orders` —
// that table's fulfillment path (fulfillOrder in lib/orders.ts) mints
// digital-download tokens, which makes no sense for a driving lesson
// booking. Reference is prefixed `lcdkhaya_` so the shared Paystack
// webhook can route the event to fulfillBooking() below instead.
export async function createBooking(input: BookingInput) {
  const reference = `lcdkhaya_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const supabase = createServiceClient();

  const { error } = await supabase.from("lcdkhaya_bookings").insert({
    paystack_reference: reference,
    package_id: input.packageId,
    package_name: input.packageName,
    amount: input.packagePrice,
    customer_name: input.customerName,
    customer_email: input.customerEmail,
    customer_phone: input.customerPhone,
    preferred_area: input.preferredArea,
    preferred_date: input.preferredDate,
    notes: input.notes,
    newsletter_opt_in: input.newsletterOptIn,
    status: "pending"
  });
  if (error) throw new Error(error.message);

  if (input.newsletterOptIn) {
    supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: input.customerEmail, full_name: input.customerName, source: "lcdkhaya-booking" },
        { onConflict: "email" }
      )
      .then(() => {});
  }

  return { reference };
}

/** Marks a booking confirmed and emails LCD Khaya + the customer.
    Idempotent — same pattern as fulfillOrder in lib/orders.ts, since
    this can be called from both the redirect verify route and the
    Paystack webhook, whichever lands first. */
export async function fulfillBooking(reference: string) {
  const supabase = createServiceClient();
  const { data: booking } = await supabase
    .from("lcdkhaya_bookings")
    .select("*")
    .eq("paystack_reference", reference)
    .single();
  if (!booking) return { status: "not_found" as const };

  if (booking.status !== "confirmed") {
    await supabase
      .from("lcdkhaya_bookings")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", booking.id);

    sendEmail({
      to: booking.customer_email,
      from: `${lcdKhayaConfig.shortName} <onboarding@resend.dev>`,
      subject: "Your booking is confirmed",
      html: `
        <p>Hi ${booking.customer_name},</p>
        <p>Thanks for booking with ${lcdKhayaConfig.shortName} — your request for <strong>${booking.package_name}</strong> has been received and payment confirmed.</p>
        <p>We'll be in touch shortly to schedule your first lesson${booking.preferred_area ? ` around ${booking.preferred_area}` : ""}.</p>
      `
    }).catch(() => {});

    sendEmail({
      to: lcdKhayaConfig.contact.email,
      from: `${lcdKhayaConfig.shortName} Bookings <onboarding@resend.dev>`,
      subject: `New paid booking — ${booking.package_name}`,
      html: `
        <p>New confirmed booking:</p>
        <ul>
          <li>Package: ${booking.package_name}</li>
          <li>Customer: ${booking.customer_name} (${booking.customer_email}, ${booking.customer_phone})</li>
          <li>Area: ${booking.preferred_area || "—"}</li>
          <li>Preferred date: ${booking.preferred_date || "—"}</li>
          <li>Notes: ${booking.notes || "—"}</li>
        </ul>
      `
    }).catch(() => {});
  }

  return { status: "confirmed" as const, booking };
}

/** Records a booking as a lead with no payment taken yet — used while
    a package's price is still TBD, so LCD Khaya can follow up and quote
    manually rather than blocking the enquiry on Paystack being configured. */
export async function recordLeadBooking(reference: string) {
  return fulfillBooking(reference);
}
