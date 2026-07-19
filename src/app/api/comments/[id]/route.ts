import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { status } = body
  if (!['pending', 'approved', 'spam', 'trash'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ status })
    .eq('id', id)
    .select('*, post:posts!post_id(slug,section)')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Refresh the live post page immediately, instead of waiting up to an
  // hour for its normal cache to expire — moderators expect to see the
  // result of approving/removing a comment right away.
  if (data?.post) {
    revalidatePath(`/${data.post.section === 'coffee' ? 'coffee' : 'blog'}/${data.post.slug}`)
  }

  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
