"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Search, Upload, Check, Image as ImageIcon } from 'lucide-react'
import type { MediaItem } from '@/types'
import FileUploadButton from './FileUploadButton'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  currentUrl?: string
}

export default function ImagePicker({ open, onClose, onSelect, currentUrl }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string>(currentUrl || '')
  const [loading, setLoading] = useState(false)
  const [ikUrl, setIkUrl] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (open) loadMedia()
  }, [open])

  const loadMedia = async () => {
    setLoading(true)
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false }).limit(50)
    setMedia(data || [])
    setLoading(false)
  }

  const filtered = media.filter(m =>
    m.original_name.toLowerCase().includes(search.toLowerCase()) ||
    (m.alt_text || '').toLowerCase().includes(search.toLowerCase())
  )

  if (!open) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:800, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:'#1e293b' }}>Choose Image</div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', padding:4 }}><X size={18}/></button>
        </div>

        {/* Toolbar */}
        <div style={{ padding:'12px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative', flex:1 }}>
            <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}/>
            <input className="cms-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search media…" style={{ paddingLeft:32, fontSize:13 }}/>
          </div>
          <FileUploadButton
            accept="image/*"
            folder="/images"
            label="Upload Image"
            onUploaded={(row) => { setSelected(row.url); loadMedia() }}
          />
          <div style={{ display:'flex', gap:8, flex:1 }}>
            <input className="cms-input" value={ikUrl} onChange={e=>setIkUrl(e.target.value)} placeholder="Or paste ImageKit URL…" style={{ fontSize:13 }}/>
            <button className="btn btn-secondary btn-sm" onClick={()=>{ if(ikUrl){ setSelected(ikUrl) } }} type="button">Use URL</button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex:1, overflowY:'auto', padding:16 }}>
          {loading && <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:14 }}>Loading media…</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'3rem' }}>
              <ImageIcon size={40} color="#e2e8f0" style={{ margin:'0 auto 1rem', display:'block' }}/>
              <p style={{ color:'#94a3b8', fontSize:14 }}>No media found. Upload images via the Media Library.</p>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {filtered.map(item => (
              <div key={item.id} onClick={()=>setSelected(item.url)}
                style={{ position:'relative', aspectRatio:'1', borderRadius:8, overflow:'hidden', cursor:'pointer', border:selected===item.url?'2px solid #8B6914':'2px solid #e2e8f0', transition:'all 0.15s' }}>
                <img src={item.thumbnail_url||item.url} alt={item.alt_text||item.file_name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                {selected===item.url && (
                  <div style={{ position:'absolute', inset:0, background:'rgba(139,105,20,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ background:'#8B6914', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Check size={14} color="#fff"/>
                    </div>
                  </div>
                )}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.6)', padding:'4px 6px' }}>
                  <div style={{ fontSize:10, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.original_name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview + confirm */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:12, justifyContent:'space-between' }}>
          {selected && (
            <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, overflow:'hidden' }}>
              <img src={selected} alt="" style={{ width:40, height:40, objectFit:'cover', borderRadius:6, flexShrink:0 }}/>
              <span style={{ fontSize:12, color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selected}</span>
            </div>
          )}
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <button className="btn btn-secondary btn-sm" onClick={onClose} type="button">Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={()=>{ if(selected){ onSelect(selected); onClose() } }} disabled={!selected} type="button">
              Use Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
