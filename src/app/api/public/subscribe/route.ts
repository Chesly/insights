import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': process.env.INSIGHTS_SITE_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const email = (body.email || '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400, headers: CORS })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({
      email,
      full_name: body.full_name || null,
      segment: body.segment || 'general',
      source: body.source || 'insights-website',
      status: 'active',
    }, { onConflict: 'email', ignoreDuplicates: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers: CORS })
  return NextResponse.json({ success: true, message: 'Subscribed successfully!' }, { headers: CORS })
}
