import crypto from "crypto";

// PayFast Custom Integration — https://developers.payfast.co.za
// Andrew's chosen payment gateway. Signed form POST + server-to-server
// ITN validation, quite different from a REST initialize/verify API —
// kept as its own small module rather than modelled on any other
// provider's integration.

const SANDBOX = process.env.PAYFAST_MODE !== "live";

export const PAYFAST_PROCESS_URL = SANDBOX
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

const PAYFAST_VALIDATE_URL = SANDBOX
  ? "https://sandbox.payfast.co.za/eng/query/validate"
  : "https://www.payfast.co.za/eng/query/validate";

// PayFast's signature is computed over the exact key order the fields
// are added in (not alphabetical), with values URL-encoded PHP-urlencode
// style (spaces as "+"), joined as key=value&key=value, then the
// passphrase appended if one is set, then MD5'd. Getting this order or
// encoding wrong silently breaks every payment, so this function is the
// single source of truth both the outgoing form and the incoming ITN
// signature check call into — never reimplement it inline elsewhere.
function pfEncode(value: string): string {
  return encodeURIComponent(value.trim()).replace(/%20/g, "+");
}

export function generateSignature(data: Record<string, string>, passphrase?: string): string {
  let output = "";
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") {
      output += `${key}=${pfEncode(String(value))}&`;
    }
  }
  output = output.slice(0, -1);
  if (passphrase) {
    output += `&passphrase=${pfEncode(passphrase)}`;
  }
  return crypto.createHash("md5").update(output).digest("hex");
}

export type PayfastFields = {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_str1?: string; // booking reference — read back out of the ITN
};

// Builds the full field set (insertion order matters — see above) plus
// its signature, ready to render as hidden inputs on an auto-submitting
// form that POSTs to PAYFAST_PROCESS_URL.
export function buildPaymentFields(input: {
  bookingReference: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}): PayfastFields & { signature: string } {
  const merchantId = process.env.PAYFAST_MERCHANT_ID || "";
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "";
  const passphrase = process.env.PAYFAST_PASSPHRASE || undefined;

  const fields: PayfastFields = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: input.returnUrl,
    cancel_url: input.cancelUrl,
    notify_url: input.notifyUrl,
    name_first: input.customerFirstName,
    name_last: input.customerLastName,
    email_address: input.customerEmail,
    m_payment_id: input.bookingReference,
    amount: input.amount.toFixed(2),
    item_name: input.itemName,
    item_description: input.itemDescription,
    custom_str1: input.bookingReference,
  };

  const signature = generateSignature(fields as unknown as Record<string, string>, passphrase);
  return { ...fields, signature };
}

// Server-to-server confirmation that an ITN POST genuinely came from
// PayFast — the officially recommended check, done in addition to (not
// instead of) the signature check, since a signature alone can't prove
// the request wasn't replayed/forged with a leaked merchant key.
export async function validateWithPayfast(rawBody: string): Promise<boolean> {
  try {
    const res = await fetch(PAYFAST_VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: rawBody,
    });
    const text = await res.text();
    return text.trim() === "VALID";
  } catch {
    return false;
  }
}
