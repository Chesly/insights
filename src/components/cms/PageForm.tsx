"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { generateSlug } from '@/lib/utils'
import type { Page } from '@/types'
import {
  Save, Send, Eye, Trash2, AlertCircle, CheckCircle,
  Settings, Search, X, ExternalLink
} from 'lucide-react'

const RichEditor = dynamic(() => import('@/components/editor/RichEditor'), { ssr: false, loading: () => (
  <div style={{ border:'1px solid #e2e8f0', borderRadius:10, height:400, display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:14 }}>Loading editor…</div>
)})

interface Props {
  page?: Page
}

type Section = 'main' | 'seo'

export default function PageForm({ page }: Props) {
  const router = useRouter()
  const isNew = !page?.id
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<Section>('main')
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [title, setTitle] = useState(page?.title || '')
  const [slug, setSlug] = useState(page?.slug || '')
  const [body, setBody] = useState(page?.body || '')
  const [bodyJson, setBodyJson] = useState<Record<string,unknown>>(page?.body_json || {})
  const [status, setStatus] = useState<Page['status']>(page?.status || 'draft')
  const [seoTitle, setSeoTitle] = useState(page?.seo_title || '')
  const [metaDesc, setMetaDesc] = useState(page?.meta_description || '')
  const [ogImage, setOgImage] = useState(page?.og_image || '')
  const [slugLocked, setSlugLocked] = useState(!isNew)

  useEffect(() => {
    if (!slugLocked && title) setSlug(generateSlug(title))
  }, [title, slugLocked])

  useEffect(() => {
    if (!seoTitle && title) setSeoTitle(title)
  }, [title])

  const buildPayload = (overrideStatus?: Page['status']) => ({
    title, slug, body, body_json: bodyJson,
    status: overrideStatus || status,
    seo_title: seoTitle || title,
    meta_description: metaDesc,
    og_image: ogImage,
  })

  const save = async (overrideStatus?: Page['status']) => {
    if (!title.trim()) { setError('Title is required'); return }
    if (!slug.trim()) { setError('URL slug is required'); return }
    setSaving(true); setSaveStatus('saving'); setError('')
    try {
      const payload = buildPayload(overrideStatus)
      const url = isNew ? '/api/pages' : `/api/pages/${page!.id}`
      const method = isNew ? 'POST' : 'PATCH'
      const res = await fetch(url, { method, headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
      if (isNew && json.data?.id) router.push(`/admin/pages/${json.data.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const deletePage = async () => {
    if (!page?.id) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pages/${page.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push('/admin/pages')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed')
      setSaving(false)
    }
  }

  const SectionBtn = ({ id, label, icon: Icon }: { id: Section; label: string; icon: React.ElementType }) => (
    <button type="button" onClick={() => setActiveSection(id)}
      style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
        background: activeSection===id ? '#fff' : 'transparent',
        color: activeSection===id ? '#1B2A4A' : '#64748b',
        boxShadow: activeSection===id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
      <Icon size={14}/>{label}
    </button>
  )

  const Label = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
    <div style={{ marginBottom:'0.4rem' }}>
      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151' }}>{children}</label>
      {sub && <p style={{ fontSize:11.5, color:'#94a3b8', marginTop:2 }}>{sub}</p>}
    </div>
  )

  const Field = ({ children }: { children: React.ReactNode }) => (
    <div style={{ marginBottom:18 }}>{children}</div>
  )

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:20, padding:24, alignItems:'start' }} className="page-editor-grid">

      {/* LEFT — main content */}
      <div>
        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fee2e2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#dc2626', fontSize:13 }}>
            <AlertCircle size={15}/>{error}
            <button onClick={()=>setError('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#dc2626' }}><X size={14}/></button>
          </div>
        )}

        <div style={{ display:'flex', gap:4, marginBottom:20, background:'#f1f5f9', borderRadius:10, padding:4, width:'fit-content' }}>
          <SectionBtn id="main" label="Content" icon={Eye}/>
          <SectionBtn id="seo" label="SEO" icon={Search}/>
        </div>

        {activeSection === 'main' && (
          <div className="cms-card" style={{ padding:24 }}>
            <Field>
              <Label>Page Title *</Label>
              <input className="cms-input" value={title} onChange={e=>setTitle(e.target.value)}
                placeholder="e.g. Shipping Policy"
                style={{ fontSize:20, fontWeight:700, padding:'12px 14px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
            </Field>

            <Field>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'0.4rem' }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151' }}>URL Slug</label>
                <button type="button" onClick={()=>setSlugLocked(!slugLocked)}
                  style={{ fontSize:11, color:'#8B6914', background:'rgba(139,105,20,0.1)', border:'none', borderRadius:6, padding:'2px 8px', cursor:'pointer', fontWeight:600 }}>
                  {slugLocked ? '🔒 Unlock' : '🔓 Auto'}
                </button>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:0, border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden' }}>
                <span style={{ padding:'9px 12px', background:'#f8fafc', fontSize:13, color:'#94a3b8', borderRight:'1px solid #e2e8f0', whiteSpace:'nowrap' }}>/</span>
                <input className="cms-input" value={slug} onChange={e=>{ setSlug(e.target.value); setSlugLocked(true) }}
                  style={{ border:'none', borderRadius:0, fontFamily:'monospace', fontSize:13 }}/>
              </div>
            </Field>

            <Field>
              <Label>Page Content</Label>
              <RichEditor
                content={body}
                contentJson={bodyJson}
                onChange={(html, json) => { setBody(html); setBodyJson(json) }}
                placeholder="Start writing this page…"
              />
            </Field>
          </div>
        )}

        {activeSection === 'seo' && (
          <div className="cms-card" style={{ padding:24 }}>
            <Field>
              <Label sub="Appears in browser tab and Google search (50-60 chars recommended)">SEO Title</Label>
              <input className="cms-input" value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} placeholder={title || "SEO-optimised title…"}/>
              <div style={{ fontSize:11, color: seoTitle.length>60?'#ef4444':'#94a3b8', textAlign:'right', marginTop:3 }}>{seoTitle.length}/60</div>
            </Field>

            <Field>
              <Label sub="Shown below the title in Google results (145-160 chars)">Meta Description</Label>
              <textarea className="cms-input cms-textarea" value={metaDesc} onChange={e=>setMetaDesc(e.target.value)}
                placeholder="A short description of this page…" rows={3} maxLength={165}/>
              <div style={{ fontSize:11, color: metaDesc.length>160?'#ef4444':'#94a3b8', textAlign:'right', marginTop:3 }}>{metaDesc.length}/160</div>
            </Field>

            <Field>
              <Label sub="Used for social sharing previews (1200×630px ideal)">OG / Social Image URL</Label>
              <input className="cms-input" value={ogImage} onChange={e=>setOgImage(e.target.value)} placeholder="https://ik.imagekit.io/mkvu8hdr5/…"/>
            </Field>

            <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Google Preview</div>
              <div style={{ fontSize:18, color:'#1a0dab', fontWeight:500, marginBottom:2, lineHeight:1.3 }}>{seoTitle || title || 'Page Title'}</div>
              <div style={{ fontSize:13, color:'#006621', marginBottom:4 }}>insights.chesly.tech/{slug || 'page-slug'}</div>
              <div style={{ fontSize:13, color:'#4d5156', lineHeight:1.5 }}>{metaDesc || 'Meta description will appear here…'}</div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — sidebar */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div className="cms-card" style={{ padding:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:12 }}>Publish</div>

          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:4 }}>Status</label>
            <select className="cms-input cms-select" value={status} onChange={e=>setStatus(e.target.value as Page['status'])} style={{ fontSize:13 }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
            <button onClick={()=>save('draft')} disabled={saving} className="btn btn-secondary" style={{ justifyContent:'center', width:'100%' }}>
              <Save size={14}/>{saving && saveStatus==='saving' ? 'Saving…' : 'Save Draft'}
            </button>
            <button onClick={()=>setShowPreview(true)} className="btn btn-secondary" style={{ justifyContent:'center', width:'100%' }}>
              <Eye size={14}/>Preview
            </button>
            <button onClick={()=>save('published')} disabled={saving} className="btn btn-primary" style={{ justifyContent:'center', width:'100%', padding:'10px' }}>
              <Send size={14}/>Publish Now
            </button>
          </div>

          {saveStatus==='saved' && (
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, fontSize:12, color:'#059669' }}>
              <CheckCircle size={13}/> Saved successfully
            </div>
          )}
          {saveStatus==='error' && (
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, fontSize:12, color:'#dc2626' }}>
              <AlertCircle size={13}/> {error || 'Save failed'}
            </div>
          )}
        </div>

        {!isNew && (
          <div className="cms-card" style={{ padding:16 }}>
            {!showDeleteConfirm ? (
              <button className="btn btn-danger" style={{ width:'100%', justifyContent:'center' }} onClick={()=>setShowDeleteConfirm(true)}>
                <Trash2 size={14}/>Delete Page
              </button>
            ) : (
              <div>
                <p style={{ fontSize:13, color:'#dc2626', fontWeight:600, marginBottom:10 }}>⚠️ Delete this page permanently?</p>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>setShowDeleteConfirm(false)} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
                  <button className="btn btn-danger btn-sm" onClick={deletePage} disabled={saving} style={{ flex:1, justifyContent:'center' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isNew && page && (
          <div className="cms-card" style={{ padding:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Page Info</div>
            {[
              ['Created', new Date(page.created_at).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})],
              ['Updated', new Date(page.updated_at).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})],
            ].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f8fafc', fontSize:12 }}>
                <span style={{ color:'#94a3b8' }}>{k}</span>
                <span style={{ color:'#374151', fontWeight:500 }}>{v}</span>
              </div>
            ))}
            {page.status === 'published' && (
              <a href={`https://insights.chesly.tech/${page.slug}`} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:10 }}>
                <ExternalLink size={13}/>View Live Page
              </a>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:999, display:'flex', flexDirection:'column' }}>
          <div style={{ background:'#0f172a', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Eye size={16} color="#C09832"/>
              <span style={{ color:'#f1f5f9', fontSize:14, fontWeight:600 }}>Page Preview</span>
              <span style={{ fontSize:12, color:'#64748b', background:'rgba(255,255,255,0.06)', padding:'2px 8px', borderRadius:6 }}>Not published</span>
            </div>
            <button onClick={()=>setShowPreview(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:4 }}><X size={18}/></button>
          </div>
          <div style={{ flex:1, overflowY:'auto', background:'#fff', padding:'3rem max(1.5rem, calc(50% - 380px))' }}>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:'clamp(1.75rem,4vw,2.5rem)', color:'#1B2A4A', lineHeight:1.2, marginBottom:'2rem' }}>{title || 'Page Title'}</h1>
            <div className="tiptap-editor" dangerouslySetInnerHTML={{ __html: body || '<p style="color:#94a3b8">No content yet…</p>' }}/>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){ .page-editor-grid{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  )
}
