import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .update({ status: 'published', published_at: now })
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)
    .select('id, title, section, slug')

  // Downloads have no separate "scheduled" status — a row waiting to go
  // live is just unpublished with a scheduled_at in the past.
  const { data: downloads, error: downloadsError } = await supabase
    .from('downloads')
    .update({ is_published: true })
    .eq('is_published', false)
    .not('scheduled_at', 'is', null)
    .lte('scheduled_at', now)
    .select('id, name, slug')

  if ((posts && posts.length > 0) || (downloads && downloads.length > 0)) {
    revalidatePath('/');
    revalidatePath('/insights');
    revalidatePath('/coffee');
    revalidatePath('/tools');
    revalidatePath('/sitemap.xml');
    for (const p of posts || []) revalidatePath(`/${p.section === 'coffee' ? 'coffee' : 'insights'}/${p.slug}`);
    for (const d of downloads || []) if (d.slug) revalidatePath(`/tools/${d.slug}`);
  }

  return NextResponse.json({
    publishedPosts: posts?.length || 0,
    publishedDownloads: downloads?.length || 0,
    posts, downloads,
    error: postsError?.message || downloadsError?.message,
  })
}
