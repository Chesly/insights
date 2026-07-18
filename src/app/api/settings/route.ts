import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key,value')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const settings: Record<string, string> = {}
  data?.forEach((row) => { settings[row.key] = row.value || '' })
  return NextResponse.json({ data: settings })
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as Record<string, string>
  const rows = Object.entries(body).map(([key, value]) => ({ key, value, updated_by: user.id }))
  if (rows.length === 0) return NextResponse.json({ data: {} })

  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data: body })
}
