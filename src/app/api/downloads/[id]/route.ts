import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { data, error } = await supabase.from('downloads').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/tools')
  if (data?.slug) revalidatePath(`/tools/${data.slug}`)
  return NextResponse.json({ data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { error } = await supabase.from('downloads').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/tools')
  return NextResponse.json({ success: true })
}
