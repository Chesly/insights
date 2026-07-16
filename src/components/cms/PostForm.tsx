"use client"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { generateSlug, estimateReadTime } from '@/lib/utils'
import Toggle from '@/components/ui/Toggle'
import TagInput from '@/components/cms/TagInput'
import ImagePicker from '@/components/cms/ImagePicker'
import type { Post, Category } from '@/types'
import {
  Save, Send, Eye, Trash2, AlertCircle, CheckCircle,
  Settings, Search, Share2, Image, ChevronDown, ChevronUp,
  ExternalLink, RefreshCw, X
} from 'lucide-react'

const RichEditor = dynamic(() => import('@/components/editor/RichEditor'), { ssr: false, loading: () => (
  <div style={{ border:'1px solid #e2e8f0', borderRadius:10, height:400, display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:14 }}>Loading editor…</div>
)})

interface Props {
  post?: Post
  categories: Category[]
}

type Section = 'main' | 'seo' | 'settings'

export default function PostForm({ post, categories }: Props) {
  const router = useRouter()
  const isNew = !post?.id
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<Section>('main')
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form state
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [body, setBody] = useState(post?.body || '')
  const [bodyJson, setBodyJson] = useState<Record<string,unknown>>(post?.body_json as Record<string,unknown> || {})
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '')
  const [imageCaption, setImageCaption] = useState(post?.image_caption || '')
  const [categoryIds, setCategoryIds] = useState<string[]>(
    post?.categories?.length ? post.categories.map(c => c.id) : (post?.category_id ? [post.category_id] : [])
  )
  const [tags, setTags] = useState<string[]>(post?.tags?.map(t => t.name) || [])
  const [status, setStatus] = useState<Post['status']>(post?.status || 'draft')
  const [featured, setFeatured] = useState(post?.featured || false)
  const [trending, setTrending] = useState(post?.trending || false)
  const [popular, setPopular] = useState(post?.popular || false)
  const [scheduledAt, setScheduledAt] = useState(post?.scheduled_at || '')
  // SEO
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '')
  const [metaDesc, setMetaDesc] = useState(post?.meta_description || '')
  const [ogImage, setOgImage] = useState(post?.og_image || '')
  const [canonical, setCanonical] = useState(post?.canonical_url || '')
  const [slugLocked, setSlugLocked] = useState(!isNew)

  // Auto-generate slug from title (new posts only)
  useEffect(() => {
    if (!slugLocked && title) setSlug(generateSlug(title))
  }, [title, slugLocked])

  // Auto-fill SEO title from title
  useEffect(() => {
    if (!seoTitle && title) setSeoTitle(title)
  }, [title])

  const readTime = estimateReadTime(body)

  const buildPayload = useCallback((overrideStatus?: Post['status']) => ({
    title, slug, excerpt, body, body_json: bodyJson,
    featured_image: featuredImage, image_caption: imageCaption,
    category_id: categoryIds[0] || null,
    category_ids: categoryIds,
    tags,
    status: overrideStatus || status,
    featured, trending, popular,
    seo_title: seoTitle || title,
    meta_description: metaDesc,
    og_image: ogImage || featuredImage,
    canonical_url: canonical,
    scheduled_at: scheduledAt || null,
    read_time: readTime,
  }), [title,slug,excerpt,body,bodyJson,featuredImage,imageCaption,categoryIds,tags,status,featured,trending,popular,seoTitle,metaDesc,ogImage,canonical,scheduledAt,readTime])

  const save = async (overrideStatus?: Post['status']) => {
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true); setSaveStatus('saving'); setError('')
    try {
      const payload = buildPayload(overrideStatus)
      const url = isNew ? '/api/posts' : `/api/posts/${post!.id}`
      const method = isNew ? 'POST' : 'PATCH'
      const res = await fetch(url, { method, headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
      if (isNew && json.data?.id) router.push(`/admin/posts/${json.data.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const deletePost = async () => {
    if (!post?.id) return
    setSaving(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push('/admin/posts')
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
    <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, padding:24, alignItems:'start' }} className="post-editor-grid">

      {/* LEFT — main content */}
      <div>
        {/* Error */}
        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fee2e2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#dc2626', fontSize:13 }}>
            <AlertCircle size={15}/>{error}
            <button onClick={()=>setError('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#dc2626' }}><X size={14}/></button>
          </div>
        )}

        {/* Section tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'#f1f5f9', borderRadius:10, padding:4, width:'fit-content' }}>
          <SectionBtn id="main" label="Content" icon={Eye}/>
          <SectionBtn id="seo" label="SEO" icon={Search}/>
          <SectionBtn id="settings" label="Settings" icon={Settings}/>
        </div>

        {/* ── MAIN SECTION ── */}
        {activeSection === 'main' && (
          <div className="cms-card" style={{ padding:24 }}>
            <Field>
              <Label>Post Title *</Label>
              <input className="cms-input" value={title} onChange={e=>setTitle(e.target.value)}
                placeholder="Enter a compelling post title…"
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
                <span style={{ padding:'9px 12px', background:'#f8fafc', fontSize:13, color:'#94a3b8', borderRight:'1px solid #e2e8f0', whiteSpace:'nowrap' }}>/insights/</span>
                <input className="cms-input" value={slug} onChange={e=>{ setSlug(e.target.value); setSlugLocked(true) }}
                  style={{ border:'none', borderRadius:0, fontFamily:'monospace', fontSize:13 }}/>
              </div>
            </Field>

            <Field>
              <Label sub="Shown on article cards and in search results (155 chars)">Excerpt</Label>
              <textarea className="cms-input cms-textarea" value={excerpt} onChange={e=>setExcerpt(e.target.value)}
                placeholder="Write a short summary of this post…" rows={3} maxLength={300}/>
              <div style={{ fontSize:11, color:'#94a3b8', textAlign:'right', marginTop:3 }}>{excerpt.length}/300</div>
            </Field>

            <Field>
              <Label>Body Content</Label>
              <RichEditor
                content={body}
                contentJson={bodyJson}
                onChange={(html, json) => { setBody(html); setBodyJson(json) }}
                placeholder="Start writing your post…"
              />
            </Field>
          </div>
        )}

        {/* ── SEO SECTION ── */}
        {activeSection === 'seo' && (
          <div className="cms-card" style={{ padding:24 }}>
            <div style={{ marginBottom:24, padding:'14px 16px', background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0', borderRadius:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#166534', marginBottom:4 }}>GEO + SEO Optimisation</div>
              <div style={{ fontSize:12, color:'#15803d' }}>These fields determine how this post appears in Google, ChatGPT, Claude, and Perplexity search results.</div>
            </div>

            <Field>
              <Label sub="Appears in browser tab and Google search (50-60 chars recommended)">SEO Title</Label>
              <input className="cms-input" value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} placeholder={title || "SEO-optimised title…"}/>
              <div style={{ fontSize:11, color: seoTitle.length>60?'#ef4444':'#94a3b8', textAlign:'right', marginTop:3 }}>{seoTitle.length}/60</div>
            </Field>

            <Field>
              <Label sub="Shown below the title in Google results (145-160 chars)">Meta Description</Label>
              <textarea className="cms-input cms-textarea" value={metaDesc} onChange={e=>setMetaDesc(e.target.value)}
                placeholder="A compelling description that makes people click…" rows={3} maxLength={165}/>
              <div style={{ fontSize:11, color: metaDesc.length>160?'#ef4444':'#94a3b8', textAlign:'right', marginTop:3 }}>{metaDesc.length}/160</div>
            </Field>

            <Field>
              <Label sub="Overrides featured image for social sharing previews (1200×630px ideal)">OG / Social Image URL</Label>
              <div style={{ display:'flex', gap:8 }}>
                <input className="cms-input" value={ogImage} onChange={e=>setOgImage(e.target.value)} placeholder="https://ik.imagekit.io/mkvu8hdr5/…"/>
                {featuredImage && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setOgImage(featuredImage)} style={{ whiteSpace:'nowrap' }}>Use Featured</button>
                )}
              </div>
            </Field>

            <Field>
              <Label sub="Leave blank to use the default URL">Canonical URL</Label>
              <input className="cms-input" value={canonical} onChange={e=>setCanonical(e.target.value)} placeholder="https://chesly.tech/insights/…"/>
            </Field>

            {/* SEO preview */}
            <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Google Preview</div>
              <div style={{ fontSize:18, color:'#1a0dab', fontWeight:500, marginBottom:2, lineHeight:1.3 }}>{seoTitle || title || 'Post Title'}</div>
              <div style={{ fontSize:13, color:'#006621', marginBottom:4 }}>chesly.tech/insights/{slug || 'post-slug'}</div>
              <div style={{ fontSize:13, color:'#4d5156', lineHeight:1.5 }}>{metaDesc || excerpt || 'Meta description will appear here…'}</div>
            </div>
          </div>
        )}

        {/* ── SETTINGS SECTION ── */}
        {activeSection === 'settings' && (
          <div className="cms-card" style={{ padding:24 }}>
            <Field>
              <Label sub="First one checked is the primary category">Categories</Label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {categories.map(c=>{
                  const checked = categoryIds.includes(c.id)
                  return (
                    <label key={c.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8,
                      border:`1px solid ${checked?'#8B6914':'#e2e8f0'}`, background:checked?'#8B691412':'#fff', cursor:'pointer', fontSize:13 }}>
                      <input type="checkbox" checked={checked} onChange={()=>{
                        setCategoryIds(prev => checked ? prev.filter(id=>id!==c.id) : [...prev, c.id])
                      }} style={{ margin:0 }}/>
                      {c.icon} {c.name}
                    </label>
                  )
                })}
              </div>
            </Field>

            <Field>
              <Label sub="Press Enter or comma to add">Tags</Label>
              <TagInput tags={tags} onChange={setTags} placeholder="Add tag…"
                suggestions={['AI','South Africa','SEO','GEO','ChatGPT','Claude','WordPress','Webflow','Entrepreneurship','Startups']}/>
            </Field>

            <div style={{ borderTop:'1px solid #f1f5f9', margin:'20px 0', paddingTop:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:12 }}>Post Flags</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#fef9ec', borderRadius:8, border:'1px solid #fde68a' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#92400e' }}>⭐ Featured</div>
                    <div style={{ fontSize:12, color:'#b45309' }}>Show in featured section on homepage</div>
                  </div>
                  <Toggle checked={featured} onChange={setFeatured}/>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#fdf4ff', borderRadius:8, border:'1px solid #f0abfc' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#7e22ce' }}>🔥 Trending</div>
                    <div style={{ fontSize:12, color:'#9333ea' }}>Show in trending / hot section</div>
                  </div>
                  <Toggle checked={trending} onChange={setTrending}/>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#eff6ff', borderRadius:8, border:'1px solid #bfdbfe' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1e40af' }}>📈 Popular</div>
                    <div style={{ fontSize:12, color:'#2563eb' }}>Show in popular articles list</div>
                  </div>
                  <Toggle checked={popular} onChange={setPopular}/>
                </div>
              </div>
            </div>

            {status === 'scheduled' && (
              <Field>
                <Label sub="Post will auto-publish at this date and time">Schedule Publish</Label>
                <input className="cms-input" type="datetime-local" value={scheduledAt} onChange={e=>setScheduledAt(e.target.value)}/>
              </Field>
            )}
          </div>
        )}
      </div>

      {/* RIGHT — sidebar */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

        {/* Publish panel */}
        <div className="cms-card" style={{ padding:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:12 }}>Publish</div>

          {/* Status */}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#64748b', display:'block', marginBottom:4 }}>Status</label>
            <select className="cms-input cms-select" value={status} onChange={e=>setStatus(e.target.value as Post['status'])} style={{ fontSize:13 }}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Read time */}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:'1px solid #f1f5f9', fontSize:12, color:'#64748b' }}>
            <span>Read time</span>
            <span style={{ fontWeight:600, color:'#374151' }}>{readTime} min</span>
          </div>

          {/* Action buttons */}
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

          {/* Save status */}
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

        {/* Featured image */}
        <div className="cms-card" style={{ padding:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#374151' }}>Featured Image</div>
            {featuredImage && (
              <button type="button" onClick={()=>setFeaturedImage('')}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:2 }}>
                <X size={14}/>
              </button>
            )}
          </div>

          {featuredImage ? (
            <div>
              <div style={{ position:'relative', borderRadius:8, overflow:'hidden', marginBottom:8 }}>
                <img src={featuredImage} alt="Featured" style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', display:'block' }}/>
                <button type="button" onClick={()=>setShowImagePicker(true)}
                  style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.15s' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='1'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='0'}>
                  <span style={{ color:'#fff', fontSize:13, fontWeight:600 }}>Change Image</span>
                </button>
              </div>
              <input className="cms-input" value={imageCaption} onChange={e=>setImageCaption(e.target.value)}
                placeholder="Image caption (optional)" style={{ fontSize:12 }}/>
            </div>
          ) : (
            <button type="button" onClick={()=>setShowImagePicker(true)}
              style={{ width:'100%', aspectRatio:'16/9', border:'2px dashed #e2e8f0', borderRadius:8, background:'#f8fafc', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.15s' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor='#8B6914'; (e.currentTarget as HTMLElement).style.background='rgba(139,105,20,0.04)' }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.background='#f8fafc' }}>
              <Image size={22} color="#94a3b8"/>
              <span style={{ fontSize:13, color:'#94a3b8', fontWeight:500 }}>Choose Image</span>
            </button>
          )}
        </div>

        {/* Delete */}
        {!isNew && (
          <div className="cms-card" style={{ padding:16 }}>
            {!showDeleteConfirm ? (
              <button className="btn btn-danger" style={{ width:'100%', justifyContent:'center' }} onClick={()=>setShowDeleteConfirm(true)}>
                <Trash2 size={14}/>Delete Post
              </button>
            ) : (
              <div>
                <p style={{ fontSize:13, color:'#dc2626', fontWeight:600, marginBottom:10 }}>⚠️ Delete this post permanently?</p>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>setShowDeleteConfirm(false)} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
                  <button className="btn btn-danger btn-sm" onClick={deletePost} disabled={saving} style={{ flex:1, justifyContent:'center' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Post info */}
        {!isNew && post && (
          <div className="cms-card" style={{ padding:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Post Info</div>
            {[
              ['ID', post.id?.slice(0,8)+'…'],
              ['Views', (post.view_count||0).toLocaleString()],
              ['Created', new Date(post.created_at).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})],
              ['Updated', new Date(post.updated_at).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})],
            ].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f8fafc', fontSize:12 }}>
                <span style={{ color:'#94a3b8' }}>{k}</span>
                <span style={{ color:'#374151', fontWeight:500 }}>{v}</span>
              </div>
            ))}
            {post.status === 'published' && (
              <a href={`https://chesly.tech/insights/${post.slug}`} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:10 }}>
                <ExternalLink size={13}/>View Live Post
              </a>
            )}
          </div>
        )}
      </div>

      {/* Image Picker Modal */}
      <ImagePicker
        open={showImagePicker}
        onClose={()=>setShowImagePicker(false)}
        onSelect={url=>{ setFeaturedImage(url); if(!ogImage) setOgImage(url) }}
        currentUrl={featuredImage}
      />

      {/* Preview Modal */}
      {showPreview && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:999, display:'flex', flexDirection:'column' }}>
          <div style={{ background:'#0f172a', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Eye size={16} color="#C09832"/>
              <span style={{ color:'#f1f5f9', fontSize:14, fontWeight:600 }}>Post Preview</span>
              <span style={{ fontSize:12, color:'#64748b', background:'rgba(255,255,255,0.06)', padding:'2px 8px', borderRadius:6 }}>Not published</span>
            </div>
            <button onClick={()=>setShowPreview(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:4 }}><X size={18}/></button>
          </div>
          <div style={{ flex:1, overflowY:'auto', background:'#fff', padding:'3rem max(1.5rem, calc(50% - 380px))' }}>
            {featuredImage && <img src={featuredImage} alt="" style={{ width:'100%', maxHeight:400, objectFit:'cover', borderRadius:12, marginBottom:'2rem' }}/>}
            {categories.find(c=>categoryIds.includes(c.id)) && (
              <div style={{ fontSize:12, fontWeight:700, color:'#8B6914', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem' }}>
                {categories.filter(c=>categoryIds.includes(c.id)).map(c=>c.name).join(' · ')}
              </div>
            )}
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:'clamp(1.75rem,4vw,2.5rem)', color:'#1B2A4A', lineHeight:1.2, marginBottom:'1rem' }}>{title || 'Post Title'}</h1>
            {excerpt && <p style={{ fontSize:18, color:'#64748b', lineHeight:1.7, marginBottom:'2rem', borderLeft:'4px solid #8B6914', paddingLeft:'1rem' }}>{excerpt}</p>}
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', fontSize:13, color:'#94a3b8', marginBottom:'2rem', paddingBottom:'2rem', borderBottom:'1px solid #e2e8f0' }}>
              <span>By Chesly Silaule</span>
              <span>·</span>
              <span>{readTime} min read</span>
              {tags.length>0 && <><span>·</span><span>{tags.join(', ')}</span></>}
            </div>
            <div className="tiptap-editor" dangerouslySetInnerHTML={{ __html: body || '<p style="color:#94a3b8">No content yet…</p>' }}/>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){ .post-editor-grid{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  )
}
