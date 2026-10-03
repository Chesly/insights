"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, FileText, Search, X } from 'lucide-react'
import type { MediaItem } from '@/types'
import { isOwnedImageKitUrl } from '@/lib/imagekit'
import FileUploadButton from './FileUploadButton'

export interface PickedDownloadFile {
  url: string
  original_name: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (file: PickedDownloadFile) => void
}

function fileNameFromUrl(value: string) {
  try {
    return decodeURIComponent(new URL(value).pathname.split('/').pop() || 'download')
  } catch {
    return 'download'
  }
}

function iconFor(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return '📄'
  if (ext === 'xlsx' || ext === 'xls') return '📊'
  if (ext === 'doc' || ext === 'docx') return '📝'
  if (ext === 'zip') return '🗜️'
  if (['mp3', 'wav', 'm4a'].includes(ext || '')) return '🎧'
  return '📦'
}

export default function DownloadFilePicker({ open, onClose, onSelect }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PickedDownloadFile | null>(null)
  const [manualUrl, setManualUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!open) return
    setSelected(null)
    setSearch('')
    setManualUrl('')
    setError('')
    const loadMedia = async () => {
      setLoading(true)
      const { data, error: queryError } = await supabase.from('media').select('*').order('created_at', { ascending: false }).limit(200)
      if (queryError) setError('Could not load the media library. Please try again.')
      setMedia((data || []) as MediaItem[])
      setLoading(false)
    }
    void loadMedia()
  }, [open, supabase])

  if (!open) return null

  const files = media.filter(item =>
    isOwnedImageKitUrl(item.url) &&
    !(item.mime_type || '').startsWith('image/') &&
    item.original_name.toLowerCase().includes(search.toLowerCase())
  )

  const useUrl = () => {
    if (!manualUrl) return
    if (!isOwnedImageKitUrl(manualUrl)) {
      setError('Use a file URL from this site’s ImageKit account, or choose it from the media library.')
      return
    }
    setError('')
    setSelected({ url: manualUrl, original_name: fileNameFromUrl(manualUrl) })
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div role="dialog" aria-modal="true" aria-label="Choose a download file" style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:720, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontWeight:700, color:'#1e293b' }}>Choose a file from the media library</div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background:'none', border:0, cursor:'pointer', color:'#64748b' }}><X size={18}/></button>
        </div>
        <div style={{ padding:14, borderBottom:'1px solid #f1f5f9', display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1 1 220px' }}>
            <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}/>
            <input className="cms-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files…" style={{ paddingLeft:32, fontSize:13 }}/>
          </div>
          <FileUploadButton accept=".pdf,.zip,.doc,.docx,.xlsx,.xls,.mp3,.wav,.m4a" folder="/downloads" label="Upload New File"
            onUploaded={row=>{ setSelected({ url:row.url, original_name:row.original_name }); setMedia(items=>[row as MediaItem,...items.filter(item=>item.id!==row.id)]) }}/>
          <input className="cms-input" value={manualUrl} onChange={e=>setManualUrl(e.target.value)} placeholder="Paste this account’s ImageKit URL" style={{ flex:'1 1 220px', fontSize:12 }}/>
          <button type="button" className="btn btn-secondary btn-sm" onClick={useUrl}>Use URL</button>
        </div>
        {error && <p role="alert" style={{ margin:0, padding:'8px 16px', color:'#dc2626', fontSize:12 }}>{error}</p>}
        <div style={{ flex:1, overflowY:'auto', padding:14 }}>
          {loading && <p style={{ textAlign:'center', padding:32, color:'#64748b' }}>Loading media library…</p>}
          {!loading && files.length===0 && <div style={{ textAlign:'center', padding:32, color:'#64748b' }}><FileText size={32} style={{ margin:'0 auto 8px' }}/><p>No matching files found. Upload a file here to add it to the library.</p></div>}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:8 }}>
            {files.map(item=>(
              <button key={item.id} type="button" onClick={()=>{setSelected({url:item.url,original_name:item.original_name});setError('')}}
                style={{ display:'flex', alignItems:'center', gap:10, textAlign:'left', padding:10, borderRadius:8, cursor:'pointer', background:selected?.url===item.url?'#fef9ec':'#fff', border:selected?.url===item.url?'2px solid #8B6914':'1px solid #e2e8f0' }}>
                <span style={{ fontSize:22 }}>{iconFor(item.original_name)}</span>
                <span style={{ minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:12, color:'#334155' }}>{item.original_name}</span>
                {selected?.url===item.url && <Check size={15} color="#8B6914"/>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          <span style={{ minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:12, color:'#64748b' }}>{selected?.original_name || 'Select a file to continue'}</span>
          <div style={{ display:'flex', gap:8 }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary btn-sm" disabled={!selected} onClick={()=>selected && onSelect(selected)}>Use File</button>
          </div>
        </div>
      </div>
    </div>
  )
}
