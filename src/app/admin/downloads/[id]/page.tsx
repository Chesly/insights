import DownloadsAdmin from '@/components/cms/DownloadsAdmin'

export default async function EditDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DownloadsAdmin mode="edit" downloadId={id} />
}
