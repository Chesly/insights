import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import PostForm from '@/components/cms/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from('posts').select(`
      *, category:categories(*), author:profiles(id,full_name,avatar_url),
      tags:post_tags(tag:tags(id,name,slug))
    `).eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!post) notFound()

  // Flatten tags for the form
  const flatPost = {
    ...post,
    tags: post.tags?.map((t: { tag: { id: string; name: string; slug: string } }) => t.tag) || [],
  }

  return (
    <>
      <Topbar title={`Edit: ${post.title.length > 40 ? post.title.slice(0,40)+'…' : post.title}`}/>
      <PostForm post={flatPost} categories={categories || []}/>
    </>
  )
}
