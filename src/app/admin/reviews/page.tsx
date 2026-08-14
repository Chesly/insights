"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Check, X, Trash2, Star, ExternalLink } from 'lucide-react'

interface Review {
  id: string
  download_id: string
  author_name: string
  author_email: string
  rating: number
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  download?: { name: string; slug: string } | null
}

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
] as const

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<typeof TABS[number]['id']>('pending')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews')
      const json = await res.json()
      setReviews(json.data || [])
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const counts = {
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  }

  const filtered = reviews.filter(r => r.status === tab)

  const updateStatus = async (id: string, status: Review['status']) => {
    setBusyId(id)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch { load() }
    setBusyId(null)
  }

  const deleteForever = async (id: string) => {
    if (!confirm('Delete this review permanently? This cannot be undone.')) return
    setBusyId(id)
    setReviews(prev => prev.filter(r => r.id !== id))
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    } catch { load() }
    setBusyId(null)
  }

  return (
    <>
      <Topbar title="Reviews" />
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
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading reviews…</p>
        ) : filtered.length === 0 ? (
          <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Star size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No reviews in {tab}.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(r => (
              <div key={r.id} className="cms-card" style={{ padding: 18, opacity: busyId === r.id ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1e293b' }}>{r.author_name}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.author_email}</span>
                      <span style={{ color: '#8B6914', fontSize: 12 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.6, marginBottom: 8 }}>{r.content}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: '#94a3b8' }}>
                      <span>{new Date(r.created_at).toLocaleString()}</span>
                      {r.download && (
                        <a
                          href={`/tools/${r.download.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#8B6914' }}
                        >
                          {r.download.name} <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {r.status !== 'approved' && (
                      <button title="Approve" onClick={() => updateStatus(r.id, 'approved')} className="btn btn-sm" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        <Check size={14} />
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button title="Reject" onClick={() => updateStatus(r.id, 'rejected')} className="btn btn-sm" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        <X size={14} />
                      </button>
                    )}
                    <button title="Delete permanently" onClick={() => deleteForever(r.id)} className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
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
