"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Plus, Edit2, Trash2, Save, X, AlertCircle, ExternalLink } from 'lucide-react'
import type { Fact } from '@/types'
import type { FaqItem } from '@/lib/types'
import { slugify } from '@/lib/types'
import { adminFetch } from '@/lib/adminFetch'

interface FormState {
  id?: string
  slug: string
  headline: string
  fact_text: string
  context: string
  source_name: string
  source_url: string
  category: string
  status: 'draft' | 'published'
  faq: FaqItem[]
}

const EMPTY: FormState = { slug:'', headline:'', fact_text:'', context:'', source_name:'', source_url:'', category:'', status:'draft', faq:[] }

const CATEGORIES = ['History', 'Geography', 'Wildlife', 'Business & Economy', 'Infrastructure', 'Culture', 'Science']

// Declared at module scope, not inside the component — see PostForm.tsx
// for why: a component defined inside a render function is recreated on
// every keystroke, which unmounts and remounts its whole subtree and
// drops input focus.
function CharHint({ value, min, max }: { value: string; min?: number; max: number }) {
  const len = value.length
  const over = len > max
  const short = min != null && len > 0 && len < min
  return (
    <div style={{ fontSize:11, textAlign:'right', marginTop:3, color: over ? '#ef4444' : short ? '#d97706' : '#94a3b8' }}>
      {len}/{max} chars{min != null ? ` — aim for ${min}–${max}` : ''}
    </div>
  )
}

type FactListItem = Pick<Fact, 'id' | 'headline' | 'slug' | 'category' | 'status'>

export default function FactsPage() {
  const [facts, setFacts] = useState<FactListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const faqAnswerRefs = useRef<Record<number, HTMLTextAreaElement | null>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/facts')
    const json = await res.json()
    setFacts(json.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const startEdit = async (id: string) => {
    const res = await fetch(`/api/facts/${id}`)
    const json = await res.json()
    const f = json.data
    setForm({
      id: f.id, slug: f.slug, headline: f.headline, fact_text: f.fact_text, context: f.context,
      source_name: f.source_name || '', source_url: f.source_url || '', category: f.category || '',
      status: f.status, faq: f.faq || [],
    })
    setShowForm(true); setError('')
  }

  const reset = () => { setForm(EMPTY); setShowForm(false); setError('') }

  const insertFaqLink = (i: number) => {
    const el = faqAnswerRefs.current[i]
    const url = window.prompt('Link to (e.g. a related article or product URL):')
    if (!url) return
    const current = form.faq[i]?.answer || ''
    const start = el ? (el.selectionStart ?? current.length) : current.length
    const end = el ? (el.selectionEnd ?? current.length) : current.length
    const selected = current.slice(start, end)
    const label = selected || window.prompt('Text to show for this link:', 'here') || 'here'
    const insertion = `[${label}](${url})`
    const newValue = current.slice(0, start) + insertion + current.slice(end)
    setForm(f => ({ ...f, faq: f.faq.map((x, idx) => idx === i ? { ...x, answer: newValue } : x) }))
    if (el) requestAnimationFrame(() => { el.focus(); const pos = start + insertion.length; el.setSelectionRange(pos, pos) })
  }

  const save = async () => {
    if (!form.headline.trim()) { setError('Headline is required'); return }
    if (!form.fact_text.trim()) { setError('The fact itself is required'); return }
    if (!form.context.trim()) { setError('Context/explanation is required'); return }
    if (form.faq.some(f => !f.question.trim() || !f.answer.trim())) {
      setError('Every FAQ needs both a question and an answer.'); return
    }
    setSaving(true); setError('')
    try {
      const payload = { ...form, slug: form.slug.trim() || slugify(form.headline) }
      const url = form.id ? `/api/facts/${form.id}` : '/api/facts'
      const method = form.id ? 'PATCH' : 'POST'
      const res = await adminFetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await load(); reset()
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  const del = async (id: string) => {
    setSaving(true)
    try { await adminFetch(`/api/facts/${id}`, { method:'DELETE' }); await load(); setDeleteId(null) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Delete failed') }
    finally { setSaving(false) }
  }

  return (
    <>
      <Topbar title="Did You Know? Facts"/>
      <div style={{ padding:24, maxWidth:900 }}>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Total Facts', value: facts.length, icon:'💡' },
            { label:'Published', value: facts.filter(f=>f.status==='published').length, icon:'✅' },
            { label:'Drafts', value: facts.filter(f=>f.status==='draft').length, icon:'📝' },
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

        {!showForm && (
          <button onClick={()=>{setShowForm(true);setError('')}} className="btn btn-primary" style={{ marginBottom:20 }}>
            <Plus size={14}/>Add Fact
          </button>
        )}

        {showForm && (
          <div className="cms-card" style={{ padding:24, marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:'#1e293b' }}>
                {form.id ? 'Edit Fact' : 'New Fact'}
              </h3>
              <button onClick={reset} className="btn btn-ghost btn-sm" style={{ padding:4 }}><X size={15}/></button>
            </div>

            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fee2e2', borderRadius:8, padding:'10px 12px', marginBottom:16, color:'#dc2626', fontSize:13 }}>
                <AlertCircle size={14}/>{error}
              </div>
            )}

            <div style={{ display:'grid', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Headline <span style={{ fontWeight:400, color:'#94a3b8' }}>(short teaser shown on cards)</span>
                </label>
                <input className="cms-input" value={form.headline} onChange={set('headline')} placeholder="e.g. Cape Town's Table Mountain is older than the Atlantic Ocean"/>
                <CharHint value={form.headline} min={30} max={90}/>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:'#374151' }}>URL Slug</label>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden' }}>
                    <span style={{ padding:'9px 12px', background:'#f8fafc', fontSize:13, color:'#94a3b8', borderRight:'1px solid #e2e8f0', whiteSpace:'nowrap' }}>/facts/</span>
                    <input className="cms-input" value={form.slug} onChange={set('slug')} placeholder="auto-generated from headline if left blank"
                      style={{ border:'none', borderRadius:0, fontFamily:'monospace', fontSize:13 }}/>
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Category</label>
                  <select className="cms-input cms-select" value={form.category} onChange={set('category')}>
                    <option value="">— None —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  The Fact <span style={{ fontWeight:400, color:'#94a3b8' }}>(the actual "did you know" statement, shown on the hero band)</span>
                </label>
                <textarea className="cms-input cms-textarea" value={form.fact_text} onChange={set('fact_text')} rows={2}
                  placeholder="e.g. Table Mountain is one of the oldest mountains in the world — older than the Atlantic Ocean itself."/>
              </div>

              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Context <span style={{ fontWeight:400, color:'#94a3b8' }}>(a short paragraph explaining/elaborating on the fact)</span>
                </label>
                <textarea className="cms-input cms-textarea" value={form.context} onChange={set('context')} rows={4}
                  placeholder="Explain why it's true, what it means, or what makes it interesting…"/>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Source Name</label>
                  <input className="cms-input" value={form.source_name} onChange={set('source_name')} placeholder="e.g. SANParks"/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Source URL</label>
                  <input className="cms-input" value={form.source_url} onChange={set('source_url')} placeholder="https://…"/>
                </div>
              </div>

              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  FAQs <span style={{ fontWeight:400, color:'#94a3b8' }}>(optional — 1-2 questions the fact might raise, for rich results)</span>
                </label>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {form.faq.map((item, i) => (
                    <div key={i} style={{ background:'#f8fafc', borderRadius:8, padding:10 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                        <div style={{ flex:1 }}>
                          <input className="cms-input" placeholder="Question"
                            value={item.question}
                            onChange={e=>setForm(f=>({...f, faq: f.faq.map((x,idx)=> idx===i ? { ...x, question:e.target.value } : x)}))}/>
                          <textarea
                            ref={el => { faqAnswerRefs.current[i] = el }}
                            className="cms-input cms-textarea" placeholder="Answer" rows={2} style={{ marginTop:6 }}
                            value={item.answer}
                            onChange={e=>setForm(f=>({...f, faq: f.faq.map((x,idx)=> idx===i ? { ...x, answer:e.target.value } : x)}))}/>
                          <button type="button" onClick={()=>insertFaqLink(i)} className="btn btn-ghost btn-sm" style={{ padding:'2px 6px', fontSize:11.5, color:'#8B6914', marginTop:3 }}>
                            🔗 Insert Link
                          </button>
                        </div>
                        <button type="button" onClick={()=>setForm(f=>({...f, faq: f.faq.filter((_,idx)=>idx!==i)}))}
                          className="btn btn-ghost btn-sm" style={{ padding:5, color:'#ef4444', flexShrink:0 }}>
                          <X size={13}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={()=>setForm(f=>({...f, faq:[...f.faq, {question:'',answer:''}]}))} className="btn btn-secondary btn-sm" style={{ marginTop:8 }}>
                  + Add FAQ
                </button>
              </div>

              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:4 }}>Status</label>
                <select className="cms-input cms-select" value={form.status} onChange={set('status')} style={{ maxWidth:200 }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <p style={{ fontSize:11.5, color:'#94a3b8', marginTop:4 }}>Only published facts are eligible for the daily homepage rotation.</p>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={reset} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button onClick={save} disabled={saving} className="btn btn-primary" style={{ flex:2, justifyContent:'center' }}>
                <Save size={14}/>{saving ? 'Saving…' : form.id ? 'Update' : 'Add Fact'}
              </button>
            </div>
          </div>
        )}

        {!loading && (
          <div className="cms-card">
            <table className="cms-table">
              <thead><tr><th>Headline</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {facts.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>No facts yet — add your first one above.</td></tr>
                )}
                {facts.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight:600, fontSize:13, maxWidth:320 }}>{f.headline}</td>
                    <td style={{ fontSize:12, color:'#64748b' }}>{f.category || '—'}</td>
                    <td>
                      <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999, background: f.status==='published' ? '#f0fdf4' : '#f1f5f9', color: f.status==='published' ? '#16a34a' : '#64748b' }}>
                        {f.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        {f.status === 'published' && (
                          <a href={`/facts/${f.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ padding:5 }}>
                            <ExternalLink size={13}/>
                          </a>
                        )}
                        <button onClick={()=>startEdit(f.id)} className="btn btn-ghost btn-sm" style={{ padding:5 }}><Edit2 size={13}/></button>
                        {deleteId === f.id ? (
                          <button onClick={()=>del(f.id)} disabled={saving} className="btn btn-danger btn-sm" style={{ padding:5, fontSize:11 }}>Confirm?</button>
                        ) : (
                          <button onClick={()=>setDeleteId(f.id)} className="btn btn-ghost btn-sm" style={{ padding:5, color:'#ef4444' }}><Trash2 size={13}/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
