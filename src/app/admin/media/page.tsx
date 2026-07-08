"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import Topbar from '@/components/layout/Topbar'
import { formatBytes } from '@/lib/utils'
import {
  Upload, Search, Grid, List, Copy, Trash2, Check, Edit2,
  Image as ImageIcon, X, AlertCircle, ExternalLink, RefreshCw, FolderOpen
} from 'lucide-react'
import type { MediaItem } from '@/types'

type ViewMode = 'grid' | 'list'

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [selected, setSelected] = useState<MediaItem|null>(null)
  const [copied, setCopied] = useState<string|null>(null)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [editItem, setEditItem] = useState<MediaItem|null>(null)
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [ikUrl, setIkUrl] = useState('')
  const [ikName, setIkName] = useState('')
  const [saving, setSaving] = useState(false)
  const [total, setTotal] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (q = '') => {
    setLoading(true)
    const res = await fetch(`/api/media?limit=60${q ? `&search=${encodeURIComponent(q)}` : ''}`)
    const json = await res.json()
    setMedia(json.data || [])
    setTotal(json.count || 0)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => load(search), 300)
    return () => clearTimeout(t)
  }, [search, load])

  // Register ImageKit URL
  const registerUrl = async () => {
    if (!ikUrl.trim()) return
    setUploading(true); setError('')
    try {
      const name = ikName.trim() || ikUrl.split('/').pop() || 'image'
      const ext = name.split('.').pop()?.toLowerCase() || 'jpg'
      const mimeMap: Record<string,string> = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp', gif:'image/gif', svg:'image/svg+xml', pdf:'application/pdf' }
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          file_name: name, original_name: name, url: ikUrl,
          thumbnail_url: ikUrl + '?tr=w-300,h-200,fo-auto',
          mime_type: mimeMap[ext] || 'image/jpeg', folder: '/',
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setIkUrl(''); setIkName(''); await load(search)
    } catch (e: any) { setError(e.message) }
    finally { setUploading(false) }
  }

  const copyUrl = async (url: string, id: string) => {
    try { await navigator.clipboard.writeText(url) } catch {}
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const startEdit = (item: MediaItem) => {
    setEditItem(item); setAltText(item.alt_text||''); setCaption(item.caption||'')
  }

  const saveEdit = async () => {
    if (!editItem) return
    setSaving(true)
    try {
      const res = await fetch(`/api/media/${editItem.id}`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ alt_text: altText, caption })
      })
      if (!res.ok) throw new Error('Save failed')
      await load(search); setEditItem(null)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const deleteMedia = async (id: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/media/${id}`, { method:'DELETE' })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error) }
      await load(search); setDeleteId(null); setSelected(null)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  // Drag-and-drop highlight
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); dropRef.current && (dropRef.current.style.borderColor='#8B6914') }
  const onDragLeave = () => { dropRef.current && (dropRef.current.style.borderColor='#e2e8f0') }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); onDragLeave()
    const url = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list')
    if (url) { setIkUrl(url) }
  }

  const isImage = (mime: string) => mime.startsWith('image/')

  return (
    <>
      <Topbar title="Media Library"/>
      <div style={{ padding:24 }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Total Files', value:total, icon:'🖼️' },
            { label:'Images', value:media.filter(m=>isImage(m.mime_type)).length, icon:'📷' },
            { label:'Documents', value:media.filter(m=>!isImage(m.mime_type)).length, icon:'📄' },
            { label:'Storage Used', value:'ImageKit', icon:'☁️' },
          ].map(s=>(
            <div key={s.label} className="stat-card" style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:26 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:22, color:'#1e293b' }}>{s.value}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload area */}
        <div ref={dropRef} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
          className="cms-card" style={{ padding:20, marginBottom:20, border:'2px dashed #e2e8f0', transition:'border-color 0.15s' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <Upload size={15} color="#8B6914"/>Register ImageKit Image
          </div>

          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fee2e2', borderRadius:8, padding:'8px 12px', marginBottom:12, color:'#dc2626', fontSize:13 }}>
              <AlertCircle size={14}/>{error}<button onClick={()=>setError('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#dc2626' }}><X size={12}/></button>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 200px 120px', gap:10, alignItems:'flex-end' }}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:4 }}>ImageKit URL *</label>
              <input className="cms-input" value={ikUrl} onChange={e=>setIkUrl(e.target.value)}
                placeholder="https://ik.imagekit.io/mkvu8hdr5/folder/image.jpg"
                style={{ fontFamily:'monospace', fontSize:12 }}/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:4 }}>Display Name</label>
              <input className="cms-input" value={ikName} onChange={e=>setIkName(e.target.value)} placeholder="hero-image.jpg" style={{ fontSize:13 }}/>
            </div>
            <button onClick={registerUrl} disabled={uploading || !ikUrl.trim()} className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>
              {uploading ? <RefreshCw size={13} style={{ animation:'spin 1s linear infinite' }}/> : <Upload size={13}/>}
              {uploading ? 'Adding…' : 'Add'}
            </button>
          </div>

          {/* Preview */}
          {ikUrl && (
            <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:10, padding:'10px', background:'#f8fafc', borderRadius:8 }}>
              <img src={`${ikUrl}?tr=w-60,h-60,fo-auto`} alt="" style={{ width:50, height:50, objectFit:'cover', borderRadius:6 }} onError={e=>(e.currentTarget.style.display='none')}/>
              <div style={{ fontSize:12, color:'#64748b', wordBreak:'break-all' }}>{ikUrl}</div>
            </div>
          )}

          <p style={{ fontSize:12, color:'#94a3b8', marginTop:10 }}>
            Upload images via <a href="https://imagekit.io/dashboard" target="_blank" rel="noopener noreferrer" style={{ color:'#8B6914' }}>ImageKit Dashboard</a>, copy the URL, paste it here to register in the media library.
            You can also drag &amp; drop an image URL onto this area.
          </p>
        </div>

        {/* Toolbar */}
        <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}/>
            <input className="cms-input" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search media…" style={{ paddingLeft:34 }}/>
          </div>
          <span style={{ fontSize:13, color:'#94a3b8', whiteSpace:'nowrap' }}>{total} file{total!==1?'s':''}</span>
          <div style={{ display:'flex', border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden' }}>
            {(['grid','list'] as ViewMode[]).map(v=>(
              <button key={v} onClick={()=>setView(v)}
                style={{ padding:'7px 12px', border:'none', cursor:'pointer', background:view===v?'#8B6914':'#fff', color:view===v?'#fff':'#64748b', display:'flex', alignItems:'center', gap:5, transition:'all 0.15s' }}>
                {v==='grid'?<Grid size={14}/>:<List size={14}/>}
              </button>
            ))}
          </div>
          <button onClick={()=>load(search)} className="btn btn-ghost btn-sm"><RefreshCw size={13}/></button>
        </div>

        {/* Media grid / list */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>Loading media…</div>
        ) : media.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem' }}>
            <ImageIcon size={48} color="#e2e8f0" style={{ margin:'0 auto 1rem', display:'block' }}/>
            <p style={{ color:'#94a3b8', fontSize:14 }}>No media found. Add your first ImageKit URL above.</p>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
            {media.map(item=>(
              <div key={item.id}
                onClick={()=>setSelected(selected?.id===item.id?null:item)}
                style={{ borderRadius:10, overflow:'hidden', border:`2px solid ${selected?.id===item.id?'#8B6914':'#e2e8f0'}`, cursor:'pointer', background:'#fff', transition:'all 0.15s', position:'relative' }}>
                <div style={{ aspectRatio:'4/3', background:'#f8fafc', overflow:'hidden' }}>
                  {isImage(item.mime_type) ? (
                    <img src={item.thumbnail_url||item.url+'?tr=w-300,h-200,fo-auto'} alt={item.alt_text||item.file_name}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  ) : (
                    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>📄</div>
                  )}
                </div>
                <div style={{ padding:'8px 10px' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#1e293b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.original_name}</div>
                  {item.file_size && <div style={{ fontSize:11, color:'#94a3b8' }}>{formatBytes(item.file_size)}</div>}
                </div>
                {/* Quick copy */}
                <button
                  onClick={e=>{e.stopPropagation();copyUrl(item.url,item.id)}}
                  style={{ position:'absolute', top:6, right:6, width:28, height:28, borderRadius:6, background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', opacity:0, transition:'opacity 0.15s' }}
                  className="copy-btn">
                  {copied===item.id?<Check size={12}/>:<Copy size={12}/>}
                </button>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="cms-card">
            <table className="cms-table">
              <thead><tr><th>File</th><th>Type</th><th>Size</th><th>Alt Text</th><th>Date</th><th style={{width:110}}>Actions</th></tr></thead>
              <tbody>
                {media.map(item=>(
                  <tr key={item.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:6, overflow:'hidden', background:'#f8fafc', flexShrink:0 }}>
                          {isImage(item.mime_type)
                            ? <img src={item.thumbnail_url||item.url+'?tr=w-80,h-80,fo-auto'} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                            : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📄</div>}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{item.original_name}</div>
                          <div style={{ fontSize:11, fontFamily:'monospace', color:'#94a3b8' }}>{item.url.slice(0,50)}…</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize:11, color:'#64748b', background:'#f1f5f9', padding:'2px 8px', borderRadius:6 }}>{item.mime_type}</span></td>
                    <td style={{ fontSize:12, color:'#94a3b8' }}>{item.file_size?formatBytes(item.file_size):'—'}</td>
                    <td style={{ fontSize:12, color:'#64748b' }}>{item.alt_text||<span style={{ color:'#e2e8f0' }}>—</span>}</td>
                    <td style={{ fontSize:12, color:'#94a3b8', whiteSpace:'nowrap' }}>{new Date(item.created_at).toLocaleDateString('en-ZA',{day:'numeric',month:'short'})}</td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button onClick={()=>copyUrl(item.url,item.id)} className="btn btn-ghost btn-sm" style={{ padding:'5px' }} title="Copy URL">
                          {copied===item.id?<Check size={13} color="#059669"/>:<Copy size={13}/>}
                        </button>
                        <button onClick={()=>startEdit(item)} className="btn btn-ghost btn-sm" style={{ padding:'5px' }} title="Edit"><Edit2 size={13}/></button>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ padding:'5px' }} title="Open"><ExternalLink size={13}/></a>
                        <button onClick={()=>setDeleteId(item.id)} className="btn btn-ghost btn-sm" style={{ padding:'5px', color:'#ef4444' }} title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected item panel */}
      {selected && (
        <div style={{ position:'fixed', right:0, top:56, bottom:0, width:300, background:'#fff', borderLeft:'1px solid #e2e8f0', zIndex:200, overflowY:'auto', boxShadow:'-4px 0 20px rgba(0,0,0,0.06)' }}>
          <div style={{ padding:16, borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>File Details</span>
            <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', padding:4 }}><X size={16}/></button>
          </div>
          <div style={{ padding:16 }}>
            <div style={{ borderRadius:10, overflow:'hidden', marginBottom:14, background:'#f8fafc' }}>
              {isImage(selected.mime_type)
                ? <img src={selected.url+'?tr=w-280,h-180,fo-auto'} alt={selected.alt_text||selected.file_name} style={{ width:'100%', display:'block' }}/>
                : <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>📄</div>}
            </div>
            {[
              ['Name', selected.original_name],
              ['Type', selected.mime_type],
              ['Size', selected.file_size ? formatBytes(selected.file_size) : '—'],
              ['Uploaded', new Date(selected.created_at).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})],
            ].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #f8fafc', fontSize:12 }}>
                <span style={{ color:'#94a3b8' }}>{k}</span>
                <span style={{ color:'#374151', fontWeight:500, textAlign:'right', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:8 }}>
              <button onClick={()=>copyUrl(selected.url,selected.id)} className="btn btn-primary btn-sm" style={{ justifyContent:'center' }}>
                {copied===selected.id?<><Check size={13}/>Copied!</>:<><Copy size={13}/>Copy URL</>}
              </button>
              <button onClick={()=>startEdit(selected)} className="btn btn-secondary btn-sm" style={{ justifyContent:'center' }}><Edit2 size={13}/>Edit Details</button>
              <a href={selected.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ justifyContent:'center' }}><ExternalLink size={13}/>Open in ImageKit</a>
              <button onClick={()=>setDeleteId(selected.id)} className="btn btn-danger btn-sm" style={{ justifyContent:'center' }}><Trash2 size={13}/>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit alt text modal */}
      {editItem && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:440, width:'100%' }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:'#1e293b', marginBottom:16 }}>Edit Media Details</h3>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:4 }}>Alt Text <span style={{ fontSize:11, color:'#94a3b8', fontWeight:400 }}>(for accessibility + SEO)</span></label>
              <input className="cms-input" value={altText} onChange={e=>setAltText(e.target.value)} placeholder="Describe what's in the image…"/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:4 }}>Caption</label>
              <input className="cms-input" value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Optional caption…"/>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setEditItem(null)} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1001, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:380, width:'100%' }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:'#1e293b', marginBottom:8 }}>Delete File?</h3>
            <p style={{ color:'#64748b', fontSize:14, marginBottom:20 }}>This removes the file from the media library. The file on ImageKit is not deleted.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setDeleteId(null)} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button onClick={()=>deleteMedia(deleteId)} disabled={saving} className="btn btn-danger" style={{ flex:1, justifyContent:'center' }}><Trash2 size={13}/>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.copy-btn{opacity:0}.cms-table tr:hover .copy-btn{opacity:1}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
