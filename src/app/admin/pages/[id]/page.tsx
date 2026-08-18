import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import PageForm from '@/components/cms/PageForm'
import { notFound } from 'next/navigation'

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('*').eq('id', id).single()
  if (!page) notFound()

  return (
    <>
      <Topbar title={`Edit: ${page.title.length > 40 ? page.title.slice(0, 40) + '…' : page.title}`} />
      <PageForm page={page} />
    </>
  )
}
