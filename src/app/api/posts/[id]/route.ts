import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateSlug, estimateReadTime } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name, slug, color, icon),
      author:profiles(id, full_name, avatar_url, email),
      tags:post_tags(tag:tags(id, name, slug))
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const tagNames: string[] = body.tags || []
  const categoryIds: string[] = body.category_ids || []
  const { tags: _tags, category_ids: _categoryIds, ...postData } = body

  // Auto set published_at
  if (postData.status === 'published' && !postData.published_at) {
    postData.published_at = new Date().toISOString()
  }
  if (postData.body) {
    postData.read_time = estimateReadTime(postData.body)
  }
  if (postData.title && !body.slug) {
    // Only auto-generate if explicitly not sent
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Sync tags
  await supabase.from('post_tags').delete().eq('post_id', id)
  for (const name of tagNames) {
    const tagSlug = generateSlug(name)
    const { data: tag } = await supabase
      .from('tags')
      .upsert({ name, slug: tagSlug }, { onConflict: 'slug' })
      .select('id')
      .single()
    if (tag) await supabase.from('post_tags').upsert({ post_id: id, tag_id: tag.id })
  }

  // Sync categories (multi-category support)
  await supabase.from('post_categories').delete().eq('post_id', id)
  for (const catId of categoryIds) {
    await supabase.from('post_categories').upsert({ post_id: id, category_id: catId })
  }

  return NextResponse.json({ data: post })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Delete tags junction first
  await supabase.from('post_tags').delete().eq('post_id', id)
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
