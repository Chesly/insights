import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { NextRequest, NextResponse } from 'next/server'

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

// POST — public. Anyone can submit the contact form; RLS's "Anyone can
// submit a contact message" INSERT policy is what actually allows this,
// the public (anon-key, no-session) client is used deliberately here so
// this route behaves identically whether the visitor is logged in or not.
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

  const supabase = createPublicClient()
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
  return NextResponse.json({ data }, { status: 201 })
}
