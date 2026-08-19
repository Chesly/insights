import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

// Editors may modify/delete their own uploads (needed for their own posts'
// images) but not other people's media — elevated roles are unrestricted.
// A role-check failure fails open, same as everywhere else this pattern
// is used.
async function assertCanModify(supabase: Awaited<ReturnType<typeof createClient>>, mediaId: string, userId: string) {
  const session = await getSessionProfile()
  if (!session || isAllowedElevatedAccess(session)) return null
  const { data: item } = await supabase.from('media').select('uploaded_by').eq('id', mediaId).single()
  if (item && item.uploaded_by !== userId) {
    return NextResponse.json({ error: 'You can only manage media you uploaded.' }, { status: 403 })
  }
  return null
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const forbidden = await assertCanModify(supabase, id, user.id)
  if (forbidden) return forbidden
  const body = await req.json()
  const { data, error } = await supabase.from('media').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const forbidden = await assertCanModify(supabase, id, user.id)
  if (forbidden) return forbidden
  const { error } = await supabase.from('media').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
