"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Check, X, Trash2, Star, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  site: string
  author_name: string
  author_email: string
  rating: number | null
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
] as const

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<typeof TABS[number]['id']>('pending')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/testimonials')
      const json = await res.json()
      setTestimonials(json.data || [])
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const counts = {
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  }

  const filtered = testimonials.filter(t => t.status === tab)

  const updateStatus = async (id: string, status: Testimonial['status']) => {
    setBusyId(id)
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch { load() }
    setBusyId(null)
  }

  const deleteForever = async (id: string) => {
    if (!confirm('Delete this testimonial permanently? This cannot be undone.')) return
    setBusyId(id)
    setTestimonials(prev => prev.filter(t => t.id !== id))
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    } catch { load() }
    setBusyId(null)
  }

  return (
    <>
      <Topbar title="Testimonials" />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="btn"
              style={{
                background: tab === t.id ? '#1e293b' : '#fff',
                color: tab === t.id ? '#fff' : '#374151',
                border: '1px solid #e2e8f0',
              }}
            >
              {t.label} <span style={{ opacity: 0.7, marginLeft: 4 }}>({counts[t.id]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading testimonials…</p>
        ) : filtered.length === 0 ? (
          <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Quote size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No testimonials in {tab}.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(t => (
              <div key={t.id} className="cms-card" style={{ padding: 18, opacity: busyId === t.id ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1e293b' }}>{t.author_name}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.author_email}</span>
                      {t.rating != null && (
                        <span style={{ color: '#8B6914', fontSize: 12 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                      )}
                      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 4, padding: '1px 6px' }}>
                        {t.site}
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.6, marginBottom: 8 }}>{t.content}</p>
                    <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{new Date(t.created_at).toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {t.status !== 'approved' && (
                      <button title="Approve" onClick={() => updateStatus(t.id, 'approved')} className="btn btn-sm" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        <Check size={14} />
                      </button>
                    )}
                    {t.status !== 'rejected' && (
                      <button title="Reject" onClick={() => updateStatus(t.id, 'rejected')} className="btn btn-sm" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        <X size={14} />
                      </button>
                    )}
                    <button title="Delete permanently" onClick={() => deleteForever(t.id)} className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
