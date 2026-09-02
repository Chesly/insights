import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateSlug } from '@/lib/utils'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

// `site` scopes the result to one client's product categories (e.g.
// 'primehealthmeds'). Omitted = the original behaviour: only the shared
// Insights blog/download categories (site IS NULL) — existing callers
// (blog/downloads category pickers) keep working unchanged and never see
// another client's catalog mixed into their dropdown.
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const site = req.nextUrl.searchParams.get('site')
  let query = supabase.from('categories').select('*, parent:categories(id,name)').order('name')
  query = site ? query.eq('site', site) : query.is('site', null)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const slug = body.slug || generateSlug(body.name)
  const { data, error } = await supabase
    .from('categories')
    .insert({ ...body, slug })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
