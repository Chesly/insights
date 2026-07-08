import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import PostForm from '@/components/cms/PostForm'

export const metadata = { title: 'New Post' }

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  return (
    <>
      <Topbar title="New Post"/>
      <PostForm categories={categories || []}/>
    </>
  )
}
