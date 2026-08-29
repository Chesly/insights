import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [comments, messages, reviews] = await Promise.all([
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const pendingComments = comments.count || 0
  const newMessages = messages.count || 0
  const pendingReviews = reviews.count || 0

  return NextResponse.json({
    pendingComments,
    newMessages,
    pendingReviews,
    total: pendingComments + newMessages + pendingReviews,
  })
}
