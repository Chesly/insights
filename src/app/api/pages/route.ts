import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, title, slug, status, updated_at, created_at')
    .order('updated_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Pages are structural site content (Terms, Privacy, About-style info
  // pages), not per-author content like Posts — same access tier as
  // Settings, not something every approved contributor should touch.
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { data, error } = await supabase
    .from('pages')
    .insert({
      title: body.title,
      slug: body.slug,
      body: body.body,
      body_json: body.body_json,
      status: body.status || 'draft',
      seo_title: body.seo_title,
      meta_description: body.meta_description,
      og_image: body.og_image,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
