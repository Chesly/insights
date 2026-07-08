import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())
    .select('id, title')
  return NextResponse.json({ published: data?.length || 0, posts: data, error: error?.message })
}
