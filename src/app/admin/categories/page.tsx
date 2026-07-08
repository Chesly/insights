"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Plus, Edit2, Trash2, Save, X, AlertCircle, FolderOpen, RefreshCw } from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import type { Category } from '@/types'

const ICONS = ['📁','🤖','🔍','💻','📣','📈','🇿🇦','🚀','🏪','📖','🎨','📋','💡','⚡','🌍','🏆']
const COLORS = ['#8B6914','#1B2A4A','#059669','#0891b2','#7c3aed','#dc2626','#ea580c','#65a30d']

interface FormState {
  id?: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  parent_id: string
}

const EMPTY: FormState = { name:'', slug:'', description:'', icon:'📁', color:'#8B6914', parent_id:'' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [editing, setEditing] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [deleteError, setDeleteError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/categories')
    const json = await res.json()
    setCategories(json.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const v = e.target.value
    setForm(f => ({
      ...f,
      [k]: v,
      ...(k === 'name' && !f.id ? { slug: generateSlug(v) } : {})
    }))
  }

  const startEdit = (cat: Category) => {
    setForm({ id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon, color: cat.color, parent_id: (cat as any).parent_id || '' })
    setEditing(true)
    setError('')
  }

  const reset = () => { setForm(EMPTY); setEditing(false); setError('') }

  const save = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true); setError('')
    try {
      const payload = { name: form.name, slug: form.slug || generateSlug(form.name), description: form.description, icon: form.icon, color: form.color, parent_id: form.parent_id || null }
      const url = form.id ? `/api/categories/${form.id}` : '/api/categories'
      const method = form.id ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await load(); reset()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const deleteCategory = async (id: string) => {
    setSaving(true); setDeleteError('')
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await load(); setDeleteId(null)
    } catch (e: any) { setDeleteError(e.message) }
    finally { setSaving(false) }
  }

  const totalPosts = categories.reduce((s, c) => s + (c.post_count || 0), 0)

  return (
    <>
      <Topbar title="Categories"/>
      <div style={{ padding:24, maxWidth:1100 }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Total Categories', value:categories.length, icon:'📁' },
            { label:'Total Posts', value:totalPosts, icon:'📝' },
            { label:'Uncategorised', value:'—', icon:'❓' },
          ].map(s=>(
            <div key={s.label} className="stat-card" style={{ display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:28 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:24, color:'#1e293b' }}>{s.value}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>

          {/* ── CATEGORIES TABLE ── */}
          <div>
            <div className="cms-card">
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:'#1e293b' }}>All Categories</h3>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={load} className="btn btn-ghost btn-sm" title="Refresh"><RefreshCw size={13}/></button>
                  <button onClick={()=>{ reset(); setEditing(true) }} className="btn btn-primary btn-sm">
                    <Plus size={13}/>Add Category
                  </button>
                </div>
              </div>

              {loading ? (
                <div style={{ padding:'3rem', textAlign:'center', color:'#94a3b8', fontSize:14 }}>Loading…</div>
              ) : categories.length === 0 ? (
                <div style={{ padding:'3rem', textAlign:'center' }}>
                  <FolderOpen size={40} color="#e2e8f0" style={{ margin:'0 auto 1rem', display:'block' }}/>
                  <p style={{ color:'#94a3b8', fontSize:14 }}>No categories yet.</p>
                  <button onClick={()=>setEditing(true)} className="btn btn-primary btn-sm" style={{ marginTop:12 }}><Plus size={13}/>Add First Category</button>
                </div>
              ) : (
                <table className="cms-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Slug</th>
                      <th>Posts</th>
                      <th style={{ width:80 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:34, height:34, borderRadius:8, background:`${cat.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                              {cat.icon}
                            </div>
                            <div>
                              <div style={{ fontWeight:700, fontSize:13.5, color:'#1e293b' }}>{cat.name}</div>
                              {cat.description && <div style={{ fontSize:12, color:'#94a3b8', marginTop:1 }}>{cat.description.slice(0,50)}{cat.description.length>50?'…':''}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily:'monospace', fontSize:12, color:'#64748b', background:'#f8fafc', padding:'2px 8px', borderRadius:6 }}>/{cat.slug}</span>
                        </td>
                        <td>
                          <span style={{ fontSize:13, fontWeight:700, color:cat.color }}>{cat.post_count || 0}</span>
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:4 }}>
                            <button onClick={()=>startEdit(cat)} className="btn btn-ghost btn-sm" style={{ padding:'5px' }} title="Edit"><Edit2 size={13}/></button>
                            <button onClick={()=>{ setDeleteId(cat.id); setDeleteError('') }} className="btn btn-ghost btn-sm" style={{ padding:'5px', color:'#ef4444' }} title="Delete"><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── FORM PANEL ── */}
          <div>
            <div className="cms-card" style={{ padding:20 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:'#1e293b' }}>
                  {form.id ? 'Edit Category' : 'New Category'}
                </h3>
                {form.id && <button onClick={reset} className="btn btn-ghost btn-sm" style={{ padding:'4px' }}><X size={14}/></button>}
              </div>

              {error && (
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fee2e2', borderRadius:8, padding:'10px 12px', marginBottom:14, color:'#dc2626', fontSize:13 }}>
                  <AlertCircle size={14}/>{error}
                </div>
              )}

              {/* Icon picker */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Icon</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {ICONS.map(icon => (
                    <button key={icon} type="button" onClick={()=>setForm(f=>({...f,icon}))}
                      style={{ width:36, height:36, borderRadius:8, fontSize:18, border:`2px solid ${form.icon===icon?'#8B6914':'#e2e8f0'}`, background:form.icon===icon?'rgba(139,105,20,0.1)':'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Colour</label>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={()=>setForm(f=>({...f,color}))}
                      style={{ width:28, height:28, borderRadius:6, background:color, border:`3px solid ${form.color===color?'#1e293b':'transparent'}`, cursor:'pointer', transition:'all 0.15s' }}/>
                  ))}
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))}
                      style={{ width:28, height:28, padding:0, border:'1px solid #e2e8f0', borderRadius:6, cursor:'pointer' }}/>
                    <span style={{ fontSize:12, fontFamily:'monospace', color:'#64748b' }}>{form.color}</span>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Name *</label>
                <input className="cms-input" value={form.name} onChange={set('name')} placeholder="e.g. Artificial Intelligence"/>
              </div>

              {/* Slug */}
              <div style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Slug</label>
                <input className="cms-input" value={form.slug} onChange={set('slug')} placeholder="auto-generated"
                  style={{ fontFamily:'monospace', fontSize:13 }}/>
              </div>

              {/* Description */}
              <div style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Description</label>
                <textarea className="cms-input cms-textarea" value={form.description} onChange={set('description')}
                  placeholder="Short description of this category…" rows={2}/>
              </div>

              {/* Parent */}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Parent Category</label>
                <select className="cms-input cms-select" value={form.parent_id} onChange={set('parent_id')}>
                  <option value="">— None (top level) —</option>
                  {categories.filter(c=>c.id!==form.id).map(c=>(
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:12, marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Preview</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${form.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{form.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{form.name || 'Category Name'}</div>
                    <div style={{ fontSize:11, color:'#94a3b8', fontFamily:'monospace' }}>/{form.slug || 'category-slug'}</div>
                  </div>
                  <div style={{ marginLeft:'auto' }}>
                    <span style={{ fontSize:11, fontWeight:700, color:form.color, background:`${form.color}18`, padding:'3px 10px', borderRadius:999 }}>Tag</span>
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                {form.id && <button onClick={reset} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>}
                <button onClick={save} disabled={saving} className="btn btn-primary" style={{ flex:2, justifyContent:'center' }}>
                  <Save size={14}/>{saving ? 'Saving…' : form.id ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:400, width:'100%' }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18, color:'#1e293b', marginBottom:8 }}>Delete Category?</h3>
            {deleteError ? (
              <div style={{ background:'#fee2e2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', color:'#dc2626', fontSize:13, marginBottom:16 }}>{deleteError}</div>
            ) : (
              <p style={{ color:'#64748b', fontSize:14, marginBottom:20 }}>This cannot be undone. Posts in this category will become uncategorised.</p>
            )}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>{ setDeleteId(null); setDeleteError('') }} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              {!deleteError && <button onClick={()=>deleteCategory(deleteId)} disabled={saving} className="btn btn-danger" style={{ flex:1, justifyContent:'center' }}><Trash2 size={13}/>Delete</button>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
