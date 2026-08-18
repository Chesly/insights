import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('pages').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

async function requireElevated() {
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const forbidden = await requireElevated()
  if (forbidden) return forbidden

  const body = await req.json()
  const { data, error } = await supabase
    .from('pages')
    .update({
      title: body.title,
      slug: body.slug,
      body: body.body,
      body_json: body.body_json,
      status: body.status,
      seo_title: body.seo_title,
      meta_description: body.meta_description,
      og_image: body.og_image,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const forbidden = await requireElevated()
  if (forbidden) return forbidden

  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
