// Thin wrapper around Resend's REST API — matches the rest of this
// codebase's convention (see checkout's Paystack calls) of a plain fetch
// rather than pulling in a provider SDK for one endpoint.
export async function sendEmail({
  to,
  from,
  replyTo,
  subject,
  html,
}: {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not configured." };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject, html }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { ok: false, error: body?.message || `Resend request failed (${res.status})` };
  }
  return { ok: true };
}
