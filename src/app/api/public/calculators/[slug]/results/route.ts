import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

interface ResultsSection {
  heading: string;
  rows: [string, string][];
}

// POST — public, optional. A visitor can already see every calculator's
// results for free with no form; this only fires when they choose to have
// a copy emailed to them, so it captures name/email/consent plus the
// results they were looking at when they asked.
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const newsletterOptIn = Boolean(body.newsletterOptIn);
  const calculatorTitle = String(body.calculatorTitle || "Calculator").trim().slice(0, 200);
  const summaryLines: string[] = Array.isArray(body.summaryLines) ? body.summaryLines.map((s: unknown) => String(s).slice(0, 500)) : [];
  const sections: ResultsSection[] = Array.isArray(body.sections)
    ? body.sections.map((s: { heading?: unknown; rows?: unknown }) => ({
        heading: String(s.heading || "").slice(0, 200),
        rows: Array.isArray(s.rows) ? s.rows.map((r: unknown) => (Array.isArray(r) ? [String(r[0]).slice(0, 200), String(r[1]).slice(0, 200)] as [string, string] : ["", ""])) : [],
      }))
    : [];

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error: insertError } = await supabase.from("calculator_leads").insert({
    calculator_slug: slug,
    name,
    email,
    newsletter_opt_in: newsletterOptIn,
    results: { calculatorTitle, summaryLines, sections },
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  if (newsletterOptIn) {
    supabase
      .from("newsletter_subscribers")
      .upsert({ email, full_name: name, source: `calculator-${slug}` }, { onConflict: "email" })
      .then(() => {});
  }

  const html = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Here's a copy of your results from the ${escapeHtml(calculatorTitle)}.</p>
    ${summaryLines.length ? `<p style="font-size:16px;font-weight:bold">${summaryLines.map(escapeHtml).join("<br>")}</p>` : ""}
    ${sections
      .map(
        (s) => `
      <h3 style="margin-top:20px">${escapeHtml(s.heading)}</h3>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        ${s.rows
          .map(
            ([label, value]) => `
          <tr style="border-bottom:1px solid #eee">
            <td>${escapeHtml(label)}</td>
            <td style="text-align:right;font-weight:600">${escapeHtml(value)}</td>
          </tr>`
          )
          .join("")}
      </table>`
      )
      .join("")}
    <hr style="margin-top:24px">
    <p style="color:#888;font-size:12px">This is a planning tool, not financial or legal advice — confirm every figure yourself before you rely on it.</p>
  `;

  // Best-effort — the lead is already saved above regardless of whether
  // this succeeds, so an unconfigured/failed send never loses the
  // submission (an admin can still see it and reach out).
  const emailResult = await sendEmail({
    to: email,
    from: "Chesly Insights Calculators <onboarding@resend.dev>",
    subject: `Your ${calculatorTitle} results`,
    html,
  });

  return NextResponse.json({ ok: true, emailed: emailResult.ok });
}
