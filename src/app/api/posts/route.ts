import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateSlug, estimateReadTime } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const slug = searchParams.get('slug')
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')
  const from = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, featured_image, image_caption,
      status, featured, trending, popular, read_time, view_count,
      published_at, scheduled_at, created_at, updated_at,
      seo_title, meta_description, og_image, canonical_url,
      category:categories(id, name, slug, color, icon),
      author:profiles(id, full_name, avatar_url),
      tags:post_tags(tag:tags(id, name, slug))
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (status) query = query.eq('status', status)
  if (slug) query = query.eq('slug', slug).single()

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data, count })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const slug = body.slug || generateSlug(body.title)
  const readTime = estimateReadTime(body.body || '')

  // Handle tags separately
  const tagNames: string[] = body.tags || []

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      title: body.title,
      slug,
      excerpt: body.excerpt,
      body: body.body,
      body_json: body.body_json,
      featured_image: body.featured_image,
      image_caption: body.image_caption,
      author_id: user.id,
      category_id: body.category_id || null,
      status: body.status || 'draft',
      featured: body.featured || false,
      trending: body.trending || false,
      popular: body.popular || false,
      seo_title: body.seo_title,
      meta_description: body.meta_description,
      og_image: body.og_image,
      canonical_url: body.canonical_url,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      scheduled_at: body.scheduled_at || null,
      read_time: readTime,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Handle tags
  if (tagNames.length > 0 && post) {
    for (const name of tagNames) {
      const tagSlug = generateSlug(name)
      const { data: tag } = await supabase
        .from('tags')
        .upsert({ name, slug: tagSlug }, { onConflict: 'slug' })
        .select('id')
        .single()
      if (tag) {
        await supabase.from('post_tags').upsert({ post_id: post.id, tag_id: tag.id })
      }
    }
  }

  return NextResponse.json({ data: post }, { status: 201 })
}
