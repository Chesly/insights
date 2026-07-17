import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, body, featured_image, image_caption,
      read_time, view_count, featured, trending, popular,
      published_at, seo_title, meta_description, og_image, canonical_url,
      category:categories!category_id(name, slug, color, icon),
      author:profiles!author_id(full_name, avatar_url, bio),
      tags:post_tags(tag:tags(name, slug))
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Increment view count async
  supabase.from('posts').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id)

  return NextResponse.json({ data }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': process.env.INSIGHTS_SITE_URL || '*',
    }
  })
}
