"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import Toggle from '@/components/ui/Toggle'
import TagInput from '@/components/cms/TagInput'
import FileUploadButton from '@/components/cms/FileUploadButton'
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Package, GripVertical } from 'lucide-react'
import type { Product, Category } from '@/types'
import { slugify } from '@/lib/types'
import { adminFetch } from '@/lib/adminFetch'

// Every physical-goods client catalog lives in this one admin screen,
// scoped by `site` — add a new client here rather than building a new
// products page. Prime Health Meds is the first; more get appended.
const KNOWN_SITES = [{ value: 'primehealthmeds', label: 'Prime Health Meds' }]

interface FormState {
  id?: string
  site: string
  name: string
  slug: string
  sku: string
  short_description: string
  description: string
  category_id: string
  price: string
  compare_at_price: string
  track_stock: boolean
  stock_quantity: string
  requires_prescription: boolean
  thumbnail_url: string
  gallery_images: string[]
  tags: string[]
  seo_title: string
  meta_description: string
  is_published: boolean
}

const EMPTY: FormState = {
  site: 'primehealthmeds', name: '', slug: '', sku: '', short_description: '', description: '',
  category_id: '', price: '', compare_at_price: '', track_stock: true, stock_quantity: '0',
  requires_prescription: false, thumbnail_url: '', gallery_images: [], tags: [],
  seo_title: '', meta_description: '', is_published: false,
}

function CharHint({ value, max }: { value: string; max: number }) {
  const len = value.length
  return <div style={{ fontSize: 11, textAlign: 'right', marginTop: 3, color: len > max ? '#ef4444' : '#94a3b8' }}>{len}/{max} chars</div>
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [siteFilter, setSiteFilter] = useState<string>(KNOWN_SITES[0].value)
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number | null>(null)

  const load = useCallback(async (site: string) => {
    setLoading(true)
    const [prodRes, catRes] = await Promise.all([
      fetch(`/api/products?site=${encodeURIComponent(site)}`),
      fetch(`/api/categories?site=${encodeURIComponent(site)}`),
    ])
    const [prodJson, catJson] = await Promise.all([prodRes.json(), catRes.json()])
    setProducts(prodJson.data || [])
    setCategories(catJson.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load(siteFilter) }, [load, siteFilter])

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const startEdit = (p: Product) => {
    setForm({
      id: p.id, site: p.site, name: p.name, slug: p.slug, sku: p.sku || '',
      short_description: p.short_description || '', description: p.description || '',
      category_id: p.category_id || '', price: String(p.price ?? ''),
      compare_at_price: p.compare_at_price != null ? String(p.compare_at_price) : '',
      track_stock: p.track_stock, stock_quantity: String(p.stock_quantity ?? 0),
      requires_prescription: p.requires_prescription, thumbnail_url: p.thumbnail_url || '',
      gallery_images: p.gallery_images || [], tags: p.tags || [],
      seo_title: p.seo_title || '', meta_description: p.meta_description || '',
      is_published: p.is_published,
    })
    setShowForm(true); setError('')
  }

  const reset = () => { setForm({ ...EMPTY, site: siteFilter }); setShowForm(false); setError('') }

  const moveGalleryImage = (from: number, to: number) => {
    if (to < 0 || from === to) return
    setForm(f => {
      const next = [...f.gallery_images]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return { ...f, gallery_images: next }
    })
  }

  const save = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.price.trim() || Number(form.price) < 0) { setError('Price is required'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        site: form.site, name: form.name, slug: form.slug || slugify(form.name),
        sku: form.sku || null, short_description: form.short_description || null,
        description: form.description || null, category_id: form.category_id || null,
        price: Number(form.price), compare_at_price: form.compare_at_price.trim() ? Number(form.compare_at_price) : null,
        track_stock: form.track_stock, stock_quantity: Number(form.stock_quantity) || 0,
        requires_prescription: form.requires_prescription, thumbnail_url: form.thumbnail_url || null,
        gallery_images: form.gallery_images, tags: form.tags,
        seo_title: form.seo_title || null, meta_description: form.meta_description || null,
        is_published: form.is_published,
      }
      const url = form.id ? `/api/products/${form.id}` : '/api/products'
      const method = form.id ? 'PATCH' : 'POST'
      const res = await adminFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await load(siteFilter); reset()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const togglePublish = async (p: Product) => {
    await adminFetch(`/api/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_published: !p.is_published }) })
    await load(siteFilter)
  }

  const del = async (id: string) => {
    setSaving(true)
    try { await adminFetch(`/api/products/${id}`, { method: 'DELETE' }); await load(siteFilter); setDeleteId(null) }
    catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const stats = {
    total: products.length,
    published: products.filter(p => p.is_published).length,
    outOfStock: products.filter(p => p.track_stock && p.stock_quantity <= 0).length,
    prescription: products.filter(p => p.requires_prescription).length,
  }

  return (
    <>
      <Topbar title="Products" />
      <div style={{ padding: 24, maxWidth: 1100 }}>

        {/* Site selector */}
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Catalog</label>
          <select className="cms-input cms-select" style={{ width: 240 }} value={siteFilter} onChange={e => setSiteFilter(e.target.value)}>
            {KNOWN_SITES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Stats */}
        <div className="cms-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Products', value: stats.total, icon: '📦' },
            { label: 'Published', value: stats.published, icon: '✅' },
            { label: 'Out of Stock', value: stats.outOfStock, icon: '⚠️' },
            { label: 'Prescription Only', value: stats.prescription, icon: '🩺' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22, color: '#1e293b' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {!showForm && (
          <button onClick={() => { setForm({ ...EMPTY, site: siteFilter }); setShowForm(true); setError('') }} className="btn btn-primary" style={{ marginBottom: 20 }}>
            <Plus size={14} />Add Product
          </button>
        )}

        {showForm && (
          <div className="cms-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: '#1e293b' }}>
                {form.id ? 'Edit Product' : 'New Product'}
              </h3>
              <button onClick={reset} className="btn btn-ghost btn-sm" style={{ padding: 4 }}><X size={15} /></button>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', borderRadius: 8, padding: '10px 12px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                <AlertCircle size={14} />{error}
              </div>
            )}

            <div className="cms-form-grid-collapse" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Name *</label>
                <input className="cms-input" value={form.name} onChange={set('name')} placeholder="Paracetamol 500mg (20 tablets)" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  <span>Slug (URL: /{form.site}/product/…)</span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, slug: slugify(f.name) }))} style={{ fontSize: 11, fontWeight: 600, color: '#8B6914', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Generate from name
                  </button>
                </label>
                <input className="cms-input" value={form.slug} onChange={set('slug')} placeholder="paracetamol-500mg-20-tablets" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>SKU</label>
                <input className="cms-input" value={form.sku} onChange={set('sku')} placeholder="PHM-PAIN-001" style={{ fontFamily: 'monospace', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Category</label>
                <select className="cms-input cms-select" value={form.category_id} onChange={set('category_id')}>
                  <option value="">— None —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Short Description <span style={{ fontWeight: 400, color: '#94a3b8' }}>(shown on product cards / listing grids)</span></label>
                <input className="cms-input" value={form.short_description} onChange={set('short_description')} placeholder="One line summary" />
                <CharHint value={form.short_description} max={120} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Full Description</label>
                <textarea className="cms-input cms-textarea" value={form.description} onChange={set('description')} rows={4} placeholder="What it is, dosage/usage notes, who it's for…" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Price (ZAR) *</label>
                <input className="cms-input" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="45.00" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Was (ZAR) <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional — shows "On Sale")</span></label>
                <input className="cms-input" type="number" min="0" step="0.01" value={form.compare_at_price} onChange={set('compare_at_price')} placeholder="e.g. 65.00" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Stock Quantity</label>
                <input className="cms-input" type="number" min="0" step="1" value={form.stock_quantity} onChange={set('stock_quantity')} disabled={!form.track_stock} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
                <Toggle checked={form.track_stock} onChange={v => setForm(f => ({ ...f, track_stock: v }))} label="Track stock" />
                <Toggle checked={form.requires_prescription} onChange={v => setForm(f => ({ ...f, requires_prescription: v }))} label="Requires prescription" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Thumbnail URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="cms-input" value={form.thumbnail_url} onChange={set('thumbnail_url')} placeholder="https://ik.imagekit.io/…" style={{ fontFamily: 'monospace', fontSize: 12, flex: 1 }} />
                  <FileUploadButton accept="image/*" folder="/products" label="Upload" onUploaded={row => setForm(f => ({ ...f, thumbnail_url: row.url }))} />
                </div>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Gallery Photos <span style={{ fontWeight: 400, color: '#94a3b8' }}>(drag to reorder)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                  {form.gallery_images.map((url, i) => (
                    <div key={url + i} draggable onDragStart={() => setDraggedGalleryIdx(i)} onDragEnd={() => setDraggedGalleryIdx(null)}
                      onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (draggedGalleryIdx != null) moveGalleryImage(draggedGalleryIdx, i); setDraggedGalleryIdx(null) }}
                      style={{ position: 'relative', width: 64, height: 64, cursor: 'grab', opacity: draggedGalleryIdx === i ? 0.4 : 1 }}>
                      <img src={url + '?tr=w-64,h-64,fo-auto'} alt="" draggable={false} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', top: 2, left: 2, width: 16, height: 16, borderRadius: 4, background: 'rgba(0,0,0,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GripVertical size={11} /></div>
                      <button type="button" onClick={() => setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_, idx) => idx !== i) }))}
                        style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', color: '#fff', border: '2px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
                <FileUploadButton accept="image/*" folder="/products" label="Add Photo" onUploaded={row => setForm(f => ({ ...f, gallery_images: [...f.gallery_images, row.url] }))} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Tags</label>
                <TagInput tags={form.tags} onChange={v => setForm(f => ({ ...f, tags: v }))} placeholder="Add a tag…" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>SEO Title</label>
                <input className="cms-input" value={form.seo_title} onChange={set('seo_title')} placeholder="Defaults to Name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Meta Description</label>
                <input className="cms-input" value={form.meta_description} onChange={set('meta_description')} placeholder="Defaults to Short Description" />
              </div>
              <div>
                <Toggle checked={form.is_published} onChange={v => setForm(f => ({ ...f, is_published: v }))} label="Published (visible on site)" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={reset} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={save} disabled={saving} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                <Save size={14} />{saving ? 'Saving…' : form.id ? 'Update' : 'Add Product'}
              </button>
            </div>
          </div>
        )}

        <div className="cms-card">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b' }}>All Products</h3>
          </div>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Loading…</div>
          ) : products.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Package size={40} color="#e2e8f0" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <p style={{ color: '#94a3b8', fontSize: 14 }}>No products yet.</p>
            </div>
          ) : (
            <table className="cms-table">
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Published</th><th style={{ width: 100 }}>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.thumbnail_url
                          ? <img src={p.thumbnail_url + '?tr=w-50,h-50,fo-auto'} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                          : <div style={{ width: 40, height: 40, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: '#1e293b' }}>{p.name}{p.requires_prescription && <span title="Requires prescription" style={{ marginLeft: 6 }}>🩺</span>}</div>
                          {p.sku && <div style={{ fontSize: 11.5, color: '#94a3b8', fontFamily: 'monospace' }}>{p.sku}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.category && (
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: p.category.color || '#8B6914', background: `${p.category.color || '#8B6914'}18`, padding: '2px 8px', borderRadius: 999 }}>
                          {p.category.name}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                      R{Number(p.price).toFixed(2)}
                      {p.compare_at_price != null && p.compare_at_price > p.price && (
                        <span style={{ marginLeft: 6, fontSize: 11.5, color: '#94a3b8', textDecoration: 'line-through' }}>R{Number(p.compare_at_price).toFixed(2)}</span>
                      )}
                    </td>
                    <td>
                      {p.track_stock ? (
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: p.stock_quantity <= 0 ? '#dc2626' : p.stock_quantity <= 10 ? '#d97706' : '#16a34a' }}>{p.stock_quantity}</span>
                      ) : <span style={{ fontSize: 12, color: '#94a3b8' }}>Not tracked</span>}
                    </td>
                    <td><Toggle checked={p.is_published} onChange={() => togglePublish(p)} size="sm" /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => startEdit(p)} className="btn btn-ghost btn-sm" style={{ padding: '5px' }}><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteId(p.id)} className="btn btn-ghost btn-sm" style={{ padding: '5px', color: '#ef4444' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 380, width: '100%' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 8 }}>Delete Product?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>This removes the product permanently.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={() => del(deleteId)} disabled={saving} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}><Trash2 size={13} />Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
