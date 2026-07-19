import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Real drag-and-drop upload, replacing the old "upload to ImageKit's own
// dashboard, then paste the URL here" workaround. The private key never
// reaches the browser — this route runs entirely server-side.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  if (!privateKey) {
    return NextResponse.json({ error: 'Upload is not configured — IMAGEKIT_PRIVATE_KEY is missing.' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || '/uploads'
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // 25MB cap — generous for PDFs/ZIPs/images while staying well inside
  // Vercel's serverless request body limits.
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'File is too large (25MB max)' }, { status: 400 })
  }

  const ikForm = new FormData()
  ikForm.append('file', file)
  ikForm.append('fileName', file.name)
  ikForm.append('folder', folder)
  ikForm.append('useUniqueFileName', 'true')

  const authHeader = 'Basic ' + Buffer.from(`${privateKey}:`).toString('base64')

  const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: authHeader },
    body: ikForm,
  })
  const ikData = await ikRes.json()

  if (!ikRes.ok) {
    return NextResponse.json({ error: ikData.message || 'Upload to ImageKit failed' }, { status: 400 })
  }

  // Register it in the media library, same as the manual-URL flow did.
  const { data, error } = await supabase
    .from('media')
    .insert({
      file_name: ikData.name,
      original_name: file.name,
      url: ikData.url,
      thumbnail_url: ikData.thumbnailUrl || null,
      mime_type: file.type || 'application/octet-stream',
      file_size: ikData.size || file.size,
      width: ikData.width || null,
      height: ikData.height || null,
      folder,
      imagekit_id: ikData.fileId,
      uploaded_by: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
