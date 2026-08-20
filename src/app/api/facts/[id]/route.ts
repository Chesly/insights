import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('facts').select('*').eq('id', id).single()
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
    .from('facts')
    .update({
      slug: body.slug,
      headline: body.headline,
      fact_text: body.fact_text,
      context: body.context,
      source_name: body.source_name || null,
      source_url: body.source_url || null,
      category: body.category || null,
      faq: body.faq || [],
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/')
  revalidatePath('/facts')
  if (data?.slug) revalidatePath(`/facts/${data.slug}`)
  return NextResponse.json({ data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const forbidden = await requireElevated()
  if (forbidden) return forbidden

  const { data: existing } = await supabase.from('facts').select('slug').eq('id', id).single()

  const { error } = await supabase.from('facts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/')
  revalidatePath('/facts')
  if (existing?.slug) revalidatePath(`/facts/${existing.slug}`)
  return NextResponse.json({ success: true })
}
