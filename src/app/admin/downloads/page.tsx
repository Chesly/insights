"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import Toggle from '@/components/ui/Toggle'
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Download as DownloadIcon, ExternalLink } from 'lucide-react'
import type { Download, Category } from '@/types'

interface FormState {
  id?: string
  name: string
  description: string
  thumbnail_url: string
  file_url: string
  file_type: string
  category_id: string
  is_premium: boolean
  is_published: boolean
}

const EMPTY: FormState = { name:'', description:'', thumbnail_url:'', file_url:'', file_type:'pdf', category_id:'', is_premium:false, is_published:false }

const FILE_TYPE_ICONS: Record<string,string> = { pdf:'📄', zip:'🗜️', doc:'📝', other:'📦' }

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [dlRes, catRes] = await Promise.all([fetch('/api/downloads'), fetch('/api/categories')])
    const [dlJson, catJson] = await Promise.all([dlRes.json(), catRes.json()])
    setDownloads(dlJson.data || [])
    setCategories(catJson.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const startEdit = (dl: Download) => {
    setForm({ id:dl.id, name:dl.name, description:dl.description||'', thumbnail_url:dl.thumbnail_url||'', file_url:dl.file_url, file_type:dl.file_type, category_id:dl.category_id||'', is_premium:dl.is_premium, is_published:dl.is_published })
    setShowForm(true); setError('')
  }

  const reset = () => { setForm(EMPTY); setShowForm(false); setError('') }

  const save = async () => {
    if (!form.name.trim() || !form.file_url.trim()) { setError('Name and File URL are required'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, category_id: form.category_id || null }
      const url = form.id ? `/api/downloads/${form.id}` : '/api/downloads'
      const method = form.id ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await load(); reset()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const togglePublish = async (dl: Download) => {
    await fetch(`/api/downloads/${dl.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ is_published:!dl.is_published }) })
    await load()
  }

  const del = async (id: string) => {
    setSaving(true)
    try { await fetch(`/api/downloads/${id}`, { method:'DELETE' }); await load(); setDeleteId(null) }
    catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const stats = {
    total: downloads.length,
    published: downloads.filter(d=>d.is_published).length,
    premium: downloads.filter(d=>d.is_premium).length,
    totalDownloads: downloads.reduce((s,d)=>s+(d.download_count||0),0),
  }

  return (
    <>
      <Topbar title="Downloads"/>
      <div style={{ padding:24, maxWidth:1100 }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Total Files', value:stats.total, icon:'📦' },
            { label:'Published', value:stats.published, icon:'✅' },
            { label:'Premium', value:stats.premium, icon:'⭐' },
            { label:'Total Downloads', value:stats.totalDownloads, icon:'📥' },
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

        {/* Add button */}
        {!showForm && (
          <button onClick={()=>{setShowForm(true);setError('')}} className="btn btn-primary" style={{ marginBottom:20 }}>
            <Plus size={14}/>Add Download
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="cms-card" style={{ padding:24, marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:'#1e293b' }}>
                {form.id ? 'Edit Download' : 'New Download'}
              </h3>
              <button onClick={reset} className="btn btn-ghost btn-sm" style={{ padding:4 }}><X size={15}/></button>
            </div>

            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fee2e2', borderRadius:8, padding:'10px 12px', marginBottom:16, color:'#dc2626', fontSize:13 }}>
                <AlertCircle size={14}/>{error}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Name *</label>
                <input className="cms-input" value={form.name} onChange={set('name')} placeholder="50 AI Prompts for SA Entrepreneurs"/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>File Type</label>
                <select className="cms-input cms-select" value={form.file_type} onChange={set('file_type')}>
                  {['pdf','zip','doc','other'].map(t=><option key={t} value={t}>{FILE_TYPE_ICONS[t]} {t.toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Description</label>
                <textarea className="cms-input cms-textarea" value={form.description} onChange={set('description')} placeholder="Brief description of what this download contains…" rows={2}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>File URL * <span style={{ fontWeight:400, color:'#94a3b8' }}>(ImageKit or direct link)</span></label>
                <input className="cms-input" value={form.file_url} onChange={set('file_url')} placeholder="https://ik.imagekit.io/mkvu8hdr5/downloads/file.pdf" style={{ fontFamily:'monospace', fontSize:12 }}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Thumbnail URL <span style={{ fontWeight:400, color:'#94a3b8' }}>(optional)</span></label>
                <input className="cms-input" value={form.thumbnail_url} onChange={set('thumbnail_url')} placeholder="https://ik.imagekit.io/mkvu8hdr5/…" style={{ fontFamily:'monospace', fontSize:12 }}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Category</label>
                <select className="cms-input cms-select" value={form.category_id} onChange={set('category_id')}>
                  <option value="">— None —</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, justifyContent:'center' }}>
                <Toggle checked={form.is_published} onChange={v=>setForm(f=>({...f,is_published:v}))} label="Published (visible on site)"/>
                <Toggle checked={form.is_premium} onChange={v=>setForm(f=>({...f,is_premium:v}))} label="Premium (requires signup)"/>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={reset} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button onClick={save} disabled={saving} className="btn btn-primary" style={{ flex:2, justifyContent:'center' }}>
                <Save size={14}/>{saving ? 'Saving…' : form.id ? 'Update' : 'Add Download'}
              </button>
            </div>
          </div>
        )}

        {/* Downloads table */}
        <div className="cms-card">
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:'#1e293b' }}>All Downloads</h3>
          </div>
          {loading ? (
            <div style={{ padding:'3rem', textAlign:'center', color:'#94a3b8', fontSize:14 }}>Loading…</div>
          ) : downloads.length === 0 ? (
            <div style={{ padding:'3rem', textAlign:'center' }}>
              <DownloadIcon size={40} color="#e2e8f0" style={{ margin:'0 auto 1rem', display:'block' }}/>
              <p style={{ color:'#94a3b8', fontSize:14 }}>No downloads yet.</p>
            </div>
          ) : (
            <table className="cms-table">
              <thead><tr><th>File</th><th>Type</th><th>Category</th><th>Published</th><th>Premium</th><th>Downloads</th><th style={{width:100}}>Actions</th></tr></thead>
              <tbody>
                {downloads.map(dl=>(
                  <tr key={dl.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        {dl.thumbnail_url
                          ? <img src={dl.thumbnail_url+'?tr=w-50,h-50,fo-auto'} alt="" style={{ width:40, height:40, objectFit:'cover', borderRadius:6 }}/>
                          : <div style={{ width:40, height:40, background:'#f1f5f9', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{FILE_TYPE_ICONS[dl.file_type]||'📦'}</div>
                        }
                        <div>
                          <div style={{ fontWeight:700, fontSize:13.5, color:'#1e293b' }}>{dl.name}</div>
                          {dl.description && <div style={{ fontSize:12, color:'#94a3b8' }}>{dl.description.slice(0,50)}{dl.description.length>50?'…':''}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize:12, background:'#f1f5f9', padding:'2px 8px', borderRadius:6, color:'#64748b' }}>{FILE_TYPE_ICONS[dl.file_type]} {dl.file_type.toUpperCase()}</span></td>
                    <td>
                      {dl.category && (
                        <span style={{ fontSize:11.5, fontWeight:600, color:(dl.category as any).color||'#8B6914', background:`${(dl.category as any).color||'#8B6914'}18`, padding:'2px 8px', borderRadius:999 }}>
                          {(dl.category as any).name}
                        </span>
                      )}
                    </td>
                    <td><Toggle checked={dl.is_published} onChange={()=>togglePublish(dl)} size="sm"/></td>
                    <td>
                      {dl.is_premium
                        ? <span style={{ fontSize:11, fontWeight:700, background:'#fef3c7', color:'#92400e', padding:'2px 8px', borderRadius:999 }}>⭐ Premium</span>
                        : <span style={{ fontSize:11, color:'#94a3b8' }}>Free</span>}
                    </td>
                    <td style={{ fontSize:13, fontWeight:700, color:'#8B6914' }}>{(dl.download_count||0).toLocaleString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button onClick={()=>startEdit(dl)} className="btn btn-ghost btn-sm" style={{ padding:'5px' }}><Edit2 size={13}/></button>
                        <a href={dl.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ padding:'5px' }}><ExternalLink size={13}/></a>
                        <button onClick={()=>setDeleteId(dl.id)} className="btn btn-ghost btn-sm" style={{ padding:'5px', color:'#ef4444' }}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:380, width:'100%' }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:'#1e293b', marginBottom:8 }}>Delete Download?</h3>
            <p style={{ color:'#64748b', fontSize:14, marginBottom:20 }}>This removes the record. The file on ImageKit/storage is not deleted.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setDeleteId(null)} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button onClick={()=>del(deleteId)} disabled={saving} className="btn btn-danger" style={{ flex:1, justifyContent:'center' }}><Trash2 size={13}/>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
