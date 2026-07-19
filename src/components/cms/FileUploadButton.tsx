"use client"
import { useRef, useState } from 'react'
import { Upload, RefreshCw } from 'lucide-react'

interface MediaRow {
  id: string
  url: string
  thumbnail_url: string | null
  original_name: string
}

export default function FileUploadButton({
  accept = '*',
  folder = '/uploads',
  label = 'Upload File',
  onUploaded,
}: {
  accept?: string
  folder?: string
  label?: string
  onUploaded: (row: MediaRow) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      onUploaded(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn btn-secondary btn-sm"
      >
        {uploading ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />}
        {uploading ? 'Uploading…' : label}
      </button>
      {error && <p style={{ fontSize: 11.5, color: '#dc2626', marginTop: 4 }}>{error}</p>}
    </div>
  )
}
