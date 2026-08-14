import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'
import { getSiteSetting } from '@/lib/settings'
import { sendEmail } from '@/lib/email'
import { siteConfig } from '@/lib/siteConfig'

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

// GET — admin only, lists contact submissions (auth enforced by RLS: the
// "Only admins can view or manage contact messages" policy rejects any
// request that isn't from a signed-in admin/super_admin).
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

// POST — public. Uses the service-role client: the "Anyone can submit a
// contact message" RLS policy that was supposed to allow an anon-key
// insert doesn't actually pass in production (confirmed live — every
// public submission was silently failing with an RLS violation before
// this). Validation below is what actually gates what gets written,
// same as the other public-write routes in this codebase already do.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const message = String(body.message || '').trim()
  const phone = body.phone ? String(body.phone).trim() : null
  const subject = body.subject ? String(body.subject).trim() : null

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email,
      phone,
      subject,
      message,
      source_page: body.source_page || '/contact',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Best-effort notification — the submission is already safely stored
  // above regardless of whether this succeeds, so a failed/unconfigured
  // send never blocks the visitor's form submission.
  const destination = (await getSiteSetting('contact_email')) || siteConfig.contact.email
  sendEmail({
    to: destination,
    from: 'Insights Contact Form <onboarding@resend.dev>',
    replyTo: email,
    subject: subject ? `New contact message: ${subject}` : `New contact message from ${name}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
      ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color:#888;font-size:12px">Also saved in your admin inbox at /admin/messages.</p>
    `,
  }).catch(() => {})

  return NextResponse.json({ data }, { status: 201 })
}
