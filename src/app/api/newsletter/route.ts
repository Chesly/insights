import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || ''
  const segment = searchParams.get('segment') || ''
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 50
  const from = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .order('subscribed_at', { ascending: false })
    .range(from, from + limit - 1)

  if (status) query = query.eq('status', status)
  if (segment) query = query.eq('segment', segment)
  if (search) query = query.ilike('email', `%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data, count })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email: body.email, full_name: body.full_name, segment: body.segment || 'general', source: body.source || 'admin' }, { onConflict: 'email' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
