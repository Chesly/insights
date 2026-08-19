"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import Toggle from '@/components/ui/Toggle'
import TagInput from '@/components/cms/TagInput'
import FileUploadButton from '@/components/cms/FileUploadButton'
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Download as DownloadIcon, ExternalLink, GripVertical } from 'lucide-react'
import type { Download, Category } from '@/types'
import type { BundleFile } from '@/lib/downloads'
import { slugify, type FaqItem } from '@/lib/types'
import { toDatetimeLocalInput, fromDatetimeLocalInput } from '@/lib/utils'

interface FormState {
  id?: string
  name: string
  slug: string
  subtitle: string
  description: string
  thumbnail_url: string
  file_url: string
  file_type: string
  category_id: string
  tier: 'free' | 'premium' | 'paid'
  price: string
  compare_at_price: string
  is_published: boolean
  scheduled_at: string
  target_audience: string[]
  solves: string[]
  seo_title: string
  meta_description: string
  store_url: string
  gallery_images: string[]
  key_features: string[]
  how_it_helps: string[]
  why_you_need_it: string[]
  tags: string[]
  bundle_files: BundleFile[]
  faq: FaqItem[]
}

const EMPTY: FormState = { name:'', slug:'', subtitle:'', description:'', thumbnail_url:'', file_url:'', file_type:'pdf', category_id:'', tier:'free', price:'', compare_at_price:'', is_published:false, scheduled_at:'', target_audience:[], solves:[], seo_title:'', meta_description:'', store_url:'', gallery_images:[], key_features:[], how_it_helps:[], why_you_need_it:[], tags:[], bundle_files:[], faq:[] }

const BUNDLE_FILE_TYPES: { value: BundleFile['fileType']; label: string }[] = [
  { value:'xlsx', label:'📊 Spreadsheet' },
  { value:'pdf', label:'📄 PDF' },
  { value:'audio', label:'🎧 Audio' },
  { value:'doc', label:'📝 Word Doc' },
  { value:'zip', label:'🗜️ Zip' },
  { value:'other', label:'📦 Other' },
]

// Only two choices in the UI now: Free, and Premium — Premium is the
// paid version, backed by the same DB value ('paid') that already drives
// the Buy Now / store_url behaviour, just relabelled here for clarity.
const TIER_OPTIONS: { value: FormState['tier']; label: string; color: string; bg: string }[] = [
  { value:'free', label:'🟢 Free', color:'#16a34a', bg:'#f0fdf4' },
  { value:'paid', label:'💎 Premium', color:'#8B6914', bg:'#fefce8' },
]

const AUDIENCE_OPTIONS = ['Small Businesses (SMEs)','Contractors','Suppliers','Manufacturers','Retailers','Startups','Consultants','NGOs','Freelancers','Accountants','Transport Companies','Construction Companies','Schools','Churches','Farmers']

const FILE_TYPE_ICONS: Record<string,string> = { pdf:'📄', zip:'🗜️', doc:'📝', other:'📦' }

// Live length feedback for SEO-facing text fields — keeps copy long enough
// to be useful to search/AI crawlers but short enough not to get truncated
// or read as padding. `min` triggers an amber "too short" warning; the
// field turns red past `max`.
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

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number|null>(null)

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
    setForm({
      id:dl.id, name:dl.name, slug:(dl as unknown as FormState).slug||'', subtitle:(dl as unknown as FormState).subtitle||'', description:dl.description||'',
      thumbnail_url:dl.thumbnail_url||'', file_url:dl.file_url, file_type:dl.file_type, category_id:dl.category_id||'',
      tier:(dl as unknown as FormState).tier || 'free', is_published:dl.is_published,
      scheduled_at: toDatetimeLocalInput((dl as unknown as { scheduled_at?: string | null }).scheduled_at),
      price: (dl as unknown as { price?: number }).price != null ? String((dl as unknown as { price?: number }).price) : '',
      compare_at_price: (dl as unknown as { compare_at_price?: number }).compare_at_price != null ? String((dl as unknown as { compare_at_price?: number }).compare_at_price) : '',
      target_audience:(dl as unknown as FormState).target_audience||[], solves:(dl as unknown as FormState).solves||[],
      seo_title:(dl as unknown as FormState).seo_title||'', meta_description:(dl as unknown as FormState).meta_description||'',
      store_url:(dl as unknown as FormState).store_url||'',
      gallery_images:(dl as unknown as FormState).gallery_images||[], key_features:(dl as unknown as FormState).key_features||[],
      how_it_helps:(dl as unknown as FormState).how_it_helps||[], why_you_need_it:(dl as unknown as FormState).why_you_need_it||[],
      tags:(dl as unknown as FormState).tags||[], bundle_files:(dl as unknown as FormState).bundle_files||[],
      faq:(dl as unknown as FormState).faq||[],
    })
    setShowForm(true); setError('')
  }

  const reset = () => { setForm(EMPTY); setShowForm(false); setError('') }

  const moveGalleryImage = (from: number, to: number) => {
    if (to < 0 || from === to) return
    setForm(f => {
      const next = [...f.gallery_images]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return { ...f, gallery_images: next }
    })
  }

  const addFaq = () => setForm(f => ({ ...f, faq: [...f.faq, { question:'', answer:'' }] }))
  const removeFaq = (i: number) => setForm(f => ({ ...f, faq: f.faq.filter((_,idx)=>idx!==i) }))
  const setFaqItem = (i: number, patch: Partial<FaqItem>) =>
    setForm(f => ({ ...f, faq: f.faq.map((item,idx)=> idx===i ? { ...item, ...patch } : item) }))

  const save = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    const hasBundle = form.bundle_files.length > 0
    if (!hasBundle && !form.file_url.trim()) { setError('Add a File URL, or add Bundle Files below, for the customer to actually download.'); return }
    if (hasBundle && form.bundle_files.some(f => !f.name.trim() || !f.url.trim())) {
      setError('Every bundle file needs both a label and an uploaded file.'); return
    }
    if (form.faq.some(f => !f.question.trim() || !f.answer.trim())) {
      setError('Every FAQ needs both a question and an answer.'); return
    }
    setSaving(true); setError('')
    try {
      // `faq` and `scheduled_at` are only sent when there's something to
      // write (or, for scheduled_at, when clearing an existing schedule on
      // an existing row) — so saving a product before those columns exist
      // in the database doesn't break every other field on the form.
      const { faq, scheduled_at: scheduledLocal, ...formRest } = form
      const scheduledIso = fromDatetimeLocalInput(scheduledLocal)
      // A future schedule always overrides the Published toggle — no need
      // to remember to leave it off when scheduling something ahead.
      const isPublished = scheduledIso && new Date(scheduledIso) > new Date() ? false : form.is_published
      const payload = {
        ...formRest, is_published: isPublished,
        category_id: form.category_id || null,
        price: form.price.trim() ? Number(form.price) : null,
        compare_at_price: form.compare_at_price.trim() ? Number(form.compare_at_price) : null,
        ...(faq.length > 0 ? { faq } : {}),
        ...(scheduledLocal ? { scheduled_at: scheduledIso } : form.id ? { scheduled_at: null } : {}),
      }
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
    premium: downloads.filter(d=>(d as unknown as FormState).tier==='paid').length,
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
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Name * <span style={{ fontWeight:400, color:'#94a3b8' }}>(used as the page title if SEO Title is left blank)</span>
                </label>
                <input className="cms-input" value={form.name} onChange={set('name')} placeholder="50 AI Prompts for SA Entrepreneurs"/>
                <CharHint value={form.name} min={30} max={60}/>
              </div>
              <div>
                <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  <span>Slug (its page URL: /tools/…)</span>
                  <button type="button" onClick={()=>setForm(f=>({...f, slug: slugify(f.name)}))}
                    style={{ fontSize:11, fontWeight:600, color:'#8B6914', background:'none', border:'none', cursor:'pointer' }}>
                    Generate from name
                  </button>
                </label>
                <input className="cms-input" value={form.slug} onChange={set('slug')} placeholder="50-ai-prompts-for-sa-entrepreneurs"/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Subtitle</label>
                <input className="cms-input" value={form.subtitle} onChange={set('subtitle')} placeholder="A short tagline under the title"/>
                <CharHint value={form.subtitle} min={40} max={100}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>File Type</label>
                <select className="cms-input cms-select" value={form.file_type} onChange={set('file_type')}>
                  {['pdf','zip','doc','other'].map(t=><option key={t} value={t}>{FILE_TYPE_ICONS[t]} {t.toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Description <span style={{ fontWeight:400, color:'#94a3b8' }}>(shown at the top of the product page, right under the name — fill in Meta Description separately below for search snippets, it's longer than Google likes)</span>
                </label>
                <textarea className="cms-input cms-textarea" value={form.description} onChange={set('description')} placeholder="What this product is, who it's for, and what it does for them…" rows={4}/>
                <CharHint value={form.description} min={300} max={550}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  File URL <span style={{ fontWeight:400, color:'#94a3b8' }}>(single-file products only — leave blank if using Bundle Files below)</span>
                </label>
                <div style={{ display:'flex', gap:8 }}>
                  <input className="cms-input" value={form.file_url} onChange={set('file_url')} placeholder="https://ik.imagekit.io/mkvu8hdr5/downloads/file.pdf" style={{ fontFamily:'monospace', fontSize:12, flex:1 }} disabled={form.bundle_files.length > 0}/>
                  <FileUploadButton
                    accept=".pdf,.zip,.doc,.docx"
                    folder="/downloads"
                    label="Upload"
                    onUploaded={(row) => {
                      const ext = (row.original_name.split('.').pop() || '').toLowerCase()
                      const fileType: FormState['file_type'] = ext === 'docx' ? 'doc' : ['pdf', 'zip', 'doc'].includes(ext) ? ext : 'other'
                      setForm(f => ({ ...f, file_url: row.url, file_type: fileType }))
                    }}
                  />
                </div>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Bundle Files <span style={{ fontWeight:400, color:'#94a3b8' }}>(most products are this — e.g. Spreadsheet + How-to-Use PDF + Audio + Word Doc, each downloaded separately)</span>
                </label>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {form.bundle_files.map((bf, i) => (
                    <div key={i} style={{ display:'flex', gap:8, alignItems:'center', background:'#f8fafc', padding:8, borderRadius:8 }}>
                      <select
                        value={bf.fileType}
                        onChange={e => setForm(f => ({ ...f, bundle_files: f.bundle_files.map((x,idx) => idx===i ? {...x, fileType: e.target.value as BundleFile['fileType']} : x) }))}
                        className="cms-input cms-select"
                        style={{ width:150, flexShrink:0 }}
                      >
                        {BUNDLE_FILE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <input
                        className="cms-input"
                        placeholder="Label, e.g. How-to-Use Guide"
                        value={bf.name}
                        onChange={e => setForm(f => ({ ...f, bundle_files: f.bundle_files.map((x,idx) => idx===i ? {...x, name: e.target.value} : x) }))}
                        style={{ flex:1 }}
                      />
                      {bf.url ? (
                        <span style={{ fontSize:12, color:'#16a34a', fontWeight:600, whiteSpace:'nowrap' }}>✓ Uploaded</span>
                      ) : (
                        <FileUploadButton
                          accept=".pdf,.zip,.doc,.docx,.xlsx,.xls,.mp3,.wav,.m4a"
                          folder="/downloads"
                          label="Upload"
                          onUploaded={(row) => setForm(f => ({ ...f, bundle_files: f.bundle_files.map((x,idx) => idx===i ? {...x, url: row.url} : x) }))}
                        />
                      )}
                      <button type="button" onClick={() => setForm(f => ({ ...f, bundle_files: f.bundle_files.filter((_,idx) => idx!==i) }))}
                        className="btn btn-ghost btn-sm" style={{ padding:5, color:'#ef4444', flexShrink:0 }}>
                        <X size={13}/>
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setForm(f => ({ ...f, bundle_files: [...f.bundle_files, { name:'', url:'', fileType:'other' }] }))}
                  className="btn btn-secondary btn-sm" style={{ marginTop:8 }}>
                  <Plus size={13}/>Add File to Bundle
                </button>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Thumbnail URL <span style={{ fontWeight:400, color:'#94a3b8' }}>(optional)</span></label>
                <div style={{ display:'flex', gap:8 }}>
                  <input className="cms-input" value={form.thumbnail_url} onChange={set('thumbnail_url')} placeholder="https://ik.imagekit.io/mkvu8hdr5/…" style={{ fontFamily:'monospace', fontSize:12, flex:1 }}/>
                  <FileUploadButton
                    accept="image/*"
                    folder="/downloads"
                    label="Upload"
                    onUploaded={(row) => setForm(f => ({ ...f, thumbnail_url: row.url }))}
                  />
                </div>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Gallery Photos <span style={{ fontWeight:400, color:'#94a3b8' }}>(extra images shown on the single product page, beyond the thumbnail above — drag to reorder)</span>
                </label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:8 }}>
                  {form.gallery_images.map((url, i) => (
                    <div key={url+i}
                      draggable
                      onDragStart={()=>setDraggedGalleryIdx(i)}
                      onDragEnd={()=>setDraggedGalleryIdx(null)}
                      onDragOver={e=>e.preventDefault()}
                      onDrop={e=>{ e.preventDefault(); if(draggedGalleryIdx!=null) moveGalleryImage(draggedGalleryIdx, i); setDraggedGalleryIdx(null) }}
                      style={{ position:'relative', width:64, height:64, cursor:'grab', opacity: draggedGalleryIdx===i ? 0.4 : 1 }}>
                      <img src={url+'?tr=w-64,h-64,fo-auto'} alt="" draggable={false}
                        style={{ width:64, height:64, objectFit:'cover', borderRadius:8, border:'1px solid #e2e8f0', pointerEvents:'none' }}/>
                      <div style={{ position:'absolute', top:2, left:2, width:16, height:16, borderRadius:4, background:'rgba(0,0,0,0.55)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <GripVertical size={11}/>
                      </div>
                      <span style={{ position:'absolute', bottom:2, left:2, fontSize:10, fontWeight:700, color:'#fff', background:'rgba(0,0,0,0.55)', borderRadius:4, padding:'0 4px' }}>{i+1}</span>
                      <button type="button" onClick={()=>setForm(f=>({...f, gallery_images: f.gallery_images.filter((_,idx)=>idx!==i)}))}
                        style={{ position:'absolute', top:-6, right:-6, width:20, height:20, borderRadius:'50%', background:'#ef4444', color:'#fff', border:'2px solid #fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, lineHeight:1 }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <FileUploadButton
                  accept="image/*"
                  folder="/downloads"
                  label="Add Photo"
                  onUploaded={(row) => setForm(f => ({ ...f, gallery_images: [...f.gallery_images, row.url] }))}
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Category</label>
                <select className="cms-input cms-select" value={form.category_id} onChange={set('category_id')}>
                  <option value="">— None —</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Target Audience <span style={{ fontWeight:400, color:'#94a3b8' }}>(short phrases, ~15–40 chars each — press Enter, or paste a comma-separated list)</span>
                </label>
                <TagInput tags={form.target_audience} onChange={v=>setForm(f=>({...f,target_audience:v}))} placeholder="Add audience…" suggestions={AUDIENCE_OPTIONS}/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Problems It Solves <span style={{ fontWeight:400, color:'#94a3b8' }}>(one problem per item, ~25–60 chars — press Enter, or paste a comma-separated list)</span>
                </label>
                <TagInput tags={form.solves} onChange={v=>setForm(f=>({...f,solves:v}))} placeholder="e.g. Cuts costs, Saves time…"/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Key Features <span style={{ fontWeight:400, color:'#94a3b8' }}>(what's actually in it — distinct from the problems it solves; ~25–60 chars each)</span>
                </label>
                <TagInput tags={form.key_features} onChange={v=>setForm(f=>({...f,key_features:v}))} placeholder="e.g. 12 pre-built formulas, Editable in Excel…"/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  How It Helps You <span style={{ fontWeight:400, color:'#94a3b8' }}>(~25–60 chars each)</span>
                </label>
                <TagInput tags={form.how_it_helps} onChange={v=>setForm(f=>({...f,how_it_helps:v}))} placeholder="e.g. See your real numbers in minutes…"/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Why You Need It <span style={{ fontWeight:400, color:'#94a3b8' }}>(~25–60 chars each)</span>
                </label>
                <TagInput tags={form.why_you_need_it} onChange={v=>setForm(f=>({...f,why_you_need_it:v}))} placeholder="e.g. Avoid costly funding mistakes…"/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Tags <span style={{ fontWeight:400, color:'#94a3b8' }}>(SEO — shown only on the single product page; 1–3 words each, 5–10 tags total)</span>
                </label>
                <TagInput tags={form.tags} onChange={v=>setForm(f=>({...f,tags:v}))} placeholder="Add a tag…"/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  FAQs <span style={{ fontWeight:400, color:'#94a3b8' }}>(shown as an accordion on the product page, plus FAQ rich-result eligibility in Google and AI answer engines — no fixed number, 4–8 is a good range for most products. Links work in answers: paste a URL directly, or use [link text](https://url) for custom wording — handy for pointing to the download itself.)</span>
                </label>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {form.faq.map((item, i) => (
                    <div key={i} style={{ background:'#f8fafc', borderRadius:8, padding:10 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                        <div style={{ flex:1 }}>
                          <input
                            className="cms-input"
                            placeholder="Question, e.g. Does this cover crypto or capital gains tax?"
                            value={item.question}
                            onChange={e=>setFaqItem(i, { question:e.target.value })}
                          />
                          <CharHint value={item.question} min={40} max={80}/>
                          <textarea
                            className="cms-input cms-textarea"
                            placeholder="Answer — direct and self-contained, since AI answer engines often quote it verbatim…"
                            value={item.answer}
                            onChange={e=>setFaqItem(i, { answer:e.target.value })}
                            rows={2}
                            style={{ marginTop:6 }}
                          />
                          <CharHint value={item.answer} min={150} max={300}/>
                        </div>
                        <button type="button" onClick={()=>removeFaq(i)}
                          className="btn btn-ghost btn-sm" style={{ padding:5, color:'#ef4444', flexShrink:0 }}>
                          <X size={13}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addFaq} className="btn btn-secondary btn-sm" style={{ marginTop:8 }}>
                  <Plus size={13}/>Add FAQ
                </button>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  SEO Title <span style={{ fontWeight:400, color:'#94a3b8' }}>(optional — appears in Google & the browser tab)</span>
                </label>
                <input className="cms-input" value={form.seo_title} onChange={set('seo_title')} placeholder="Defaults to Name if left blank"/>
                <CharHint value={form.seo_title} min={50} max={60}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Meta Description <span style={{ fontWeight:400, color:'#94a3b8' }}>(optional — shown below the title in Google results)</span>
                </label>
                <input className="cms-input" value={form.meta_description} onChange={set('meta_description')} placeholder="Defaults to Description if left blank"/>
                <CharHint value={form.meta_description} min={145} max={160}/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                  Store / Checkout Link <span style={{ fontWeight:400, color:'#94a3b8' }}>(only used when Tier is Paid — leave blank until you have a payment link)</span>
                </label>
                <input className="cms-input" value={form.store_url} onChange={set('store_url')} placeholder="https://…"/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>Access Tier</label>
                <div style={{ display:'flex', gap:8 }}>
                  {TIER_OPTIONS.map(opt=>(
                    <button key={opt.value} type="button" onClick={()=>setForm(f=>({...f,tier:opt.value}))}
                      style={{ flex:1, padding:'10px 14px', borderRadius:8, fontWeight:600, fontSize:13.5, cursor:'pointer',
                        border:`1px solid ${form.tier===opt.value?opt.color:'#e2e8f0'}`,
                        background:form.tier===opt.value?opt.bg:'#fff',
                        color:form.tier===opt.value?opt.color:'#374151' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {form.tier === 'paid' && (
                  <div style={{ marginTop:10, display:'flex', gap:10 }}>
                    <div style={{ flex:1 }}>
                      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                        Price (ZAR)
                      </label>
                      <input className="cms-input" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="149"/>
                    </div>
                    <div style={{ flex:1 }}>
                      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                        Was (ZAR) <span style={{ fontWeight:400, color:'#94a3b8' }}>(optional — set to show "On Sale")</span>
                      </label>
                      <input className="cms-input" type="number" min="0" step="0.01" value={form.compare_at_price} onChange={set('compare_at_price')} placeholder="e.g. 249"/>
                    </div>
                  </div>
                )}
                {form.tier === 'paid' && form.price && form.compare_at_price && Number(form.compare_at_price) > Number(form.price) && (
                  <p style={{ marginTop:6, fontSize:12, fontWeight:600, color:'#8B6914' }}>
                    Will show as: On Sale — R{form.price} <span style={{ textDecoration:'line-through', color:'#94a3b8', fontWeight:400 }}>R{form.compare_at_price}</span>
                  </p>
                )}
                <p style={{ fontSize:11.5, color:'#94a3b8', marginTop:6 }}>
                  Free — instant download, no form. Premium — the paid version; set a price above and a Store/Checkout Link when you have one, or it shows &quot;Coming Soon&quot; until you do.
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, justifyContent:'center' }}>
                <Toggle checked={form.is_published} onChange={v=>setForm(f=>({...f,is_published:v}))} label="Published (visible on site)"/>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:4 }}>
                    Schedule for later <span style={{ fontWeight:400, color:'#94a3b8' }}>(optional — overrides Published above until this time)</span>
                  </label>
                  <div style={{ display:'flex', gap:8 }}>
                    <input className="cms-input" type="datetime-local" value={form.scheduled_at} onChange={set('scheduled_at')} style={{ flex:1 }}/>
                    {form.scheduled_at && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setForm(f=>({...f,scheduled_at:''}))}>Clear</button>
                    )}
                  </div>
                </div>
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
                    <td>
                      <Toggle checked={dl.is_published} onChange={()=>togglePublish(dl)} size="sm"/>
                      {!dl.is_published && dl.scheduled_at && new Date(dl.scheduled_at) > new Date() && (
                        <div style={{ fontSize:10.5, color:'#8B6914', marginTop:4, whiteSpace:'nowrap' }}>
                          ⏰ {new Date(dl.scheduled_at).toLocaleString('en-ZA', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                        </div>
                      )}
                    </td>
                    <td>
                      {(() => {
                        const t = (dl as unknown as FormState).tier || 'free'
                        const price = (dl as unknown as { price?: number }).price
                        if (t === 'paid') return <span style={{ fontSize:11, fontWeight:700, background:'#fefce8', color:'#8B6914', padding:'2px 8px', borderRadius:999 }}>💎 Premium{price!=null?` — R${price}`:''}</span>
                        if (t === 'premium') return <span style={{ fontSize:11, fontWeight:700, background:'#f1f5f9', color:'#64748b', padding:'2px 8px', borderRadius:999 }} title="Legacy tier — no longer selectable, consider moving to Free or Premium">🟡 Legacy Premium</span>
                        return <span style={{ fontSize:11, fontWeight:700, background:'#f0fdf4', color:'#16a34a', padding:'2px 8px', borderRadius:999 }}>🟢 Free</span>
                      })()}
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
