import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const RESULT_LIMIT = 5

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = new URL(req.url).searchParams.get('q')?.trim() || ''
  if (q.length < 2) return NextResponse.json({ posts: [], pages: [], downloads: [], media: [] })

  const like = `%${q}%`
  const [posts, pages, downloads, media] = await Promise.all([
    supabase.from('posts').select('id,title,slug,status').ilike('title', like).limit(RESULT_LIMIT),
    supabase.from('pages').select('id,title,slug,status').ilike('title', like).limit(RESULT_LIMIT),
    supabase.from('downloads').select('id,name,slug').ilike('name', like).limit(RESULT_LIMIT),
    supabase.from('media').select('id,original_name,url').ilike('original_name', like).limit(RESULT_LIMIT),
  ])

  return NextResponse.json({
    posts: posts.data || [],
    pages: pages.data || [],
    downloads: downloads.data || [],
    media: media.data || [],
  })
}
