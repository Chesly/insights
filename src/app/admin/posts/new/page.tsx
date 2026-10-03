import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import PostForm from '@/components/cms/PostForm'

export const metadata = { title: 'New Post' }

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams
  const isHowTo = type === 'how-to'
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  return (
    <>
      <Topbar title={isHowTo ? 'New How To Guide' : 'New Post'} action={{ label:isHowTo ? 'How To Guides' : 'Posts', href:isHowTo ? '/admin/posts?tag=how-to' : '/admin/posts' }}/>
      <PostForm categories={categories || []} initialTags={isHowTo ? ['How To'] : []}/>
    </>
  )
}
