import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const from = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, featured_image, read_time, view_count,
      featured, trending, popular, published_at,
      category:categories!category_id(name, slug, color, icon),
      author:profiles!author_id(full_name, avatar_url),
      tags:post_tags(tag:tags(name, slug))
    `, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, from + limit - 1)

  if (category) query = query.eq('categories.slug', category)
  if (featured === 'true') query = query.eq('featured', true)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ data, count }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Access-Control-Allow-Origin': process.env.INSIGHTS_SITE_URL || '*',
    }
  })
}
