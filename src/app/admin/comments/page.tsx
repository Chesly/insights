"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Check, X, Trash2, AlertOctagon, MessageSquare, ExternalLink } from 'lucide-react'

interface Comment {
  id: string
  post_id: string
  parent_id: string | null
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved' | 'spam' | 'trash'
  created_at: string
  post?: { title: string; slug: string; section: string } | null
}

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'spam', label: 'Spam' },
  { id: 'trash', label: 'Trash' },
] as const

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<typeof TABS[number]['id']>('pending')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/comments')
      const json = await res.json()
      setComments(json.data || [])
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const counts = {
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    spam: comments.filter(c => c.status === 'spam').length,
    trash: comments.filter(c => c.status === 'trash').length,
  }

  const filtered = comments.filter(c => c.status === tab)

  const updateStatus = async (id: string, status: Comment['status']) => {
    setBusyId(id)
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    try {
      await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch { load() }
    setBusyId(null)
  }

  const deleteForever = async (id: string) => {
    if (!confirm('Delete this comment permanently? This cannot be undone.')) return
    setBusyId(id)
    setComments(prev => prev.filter(c => c.id !== id))
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    } catch { load() }
    setBusyId(null)
  }

  return (
    <>
      <Topbar title="Comments" />
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
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading comments…</p>
        ) : filtered.length === 0 ? (
          <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <MessageSquare size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No comments in {tab}.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(c => (
              <div key={c.id} className="cms-card" style={{ padding: 18, opacity: busyId === c.id ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1e293b' }}>{c.author_name}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{c.author_email}</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.6, marginBottom: 8 }}>{c.content}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: '#94a3b8' }}>
                      <span>{new Date(c.created_at).toLocaleString()}</span>
                      {c.post && (
                        <a
                          href={`/${c.post.section === 'coffee' ? 'coffee' : 'blog'}/${c.post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#8B6914' }}
                        >
                          {c.post.title} <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {c.status !== 'approved' && (
                      <button title="Approve" onClick={() => updateStatus(c.id, 'approved')} className="btn btn-sm" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        <Check size={14} />
                      </button>
                    )}
                    {c.status !== 'spam' && (
                      <button title="Mark spam" onClick={() => updateStatus(c.id, 'spam')} className="btn btn-sm" style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}>
                        <AlertOctagon size={14} />
                      </button>
                    )}
                    {c.status !== 'trash' && (
                      <button title="Trash" onClick={() => updateStatus(c.id, 'trash')} className="btn btn-sm" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        <X size={14} />
                      </button>
                    )}
                    <button title="Delete permanently" onClick={() => deleteForever(c.id)} className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
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
