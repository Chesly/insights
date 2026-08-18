import Topbar from '@/components/layout/Topbar'
import PageForm from '@/components/cms/PageForm'

export const metadata = { title: 'New Page' }

export default function NewPagePage() {
  return (
    <>
      <Topbar title="New Page" />
      <PageForm />
    </>
  )
}
