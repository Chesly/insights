"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Mail, Phone, MessageSquare, Trash2, Download as DownloadIcon, CheckCircle2 } from 'lucide-react'
import type { ContactMessage } from '@/types'

const STATUS_CFG: Record<string, { label: string; bg: string; color: string }> = {
  new:      { label: 'New',      bg: '#fefce8', color: '#8B6914' },
  read:     { label: 'Read',     bg: '#eff6ff', color: '#1d4ed8' },
  replied:  { label: 'Replied',  bg: '#d1fae5', color: '#065f46' },
  archived: { label: 'Archived', bg: '#f1f5f9', color: '#64748b' },
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/contact')
      const json = await res.json()
      setMessages(json.data || [])
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, status: status as ContactMessage['status'] } : m)))
    await fetch(`/api/contact/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const remove = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: 'DELETE' })
    setMessages(prev => prev.filter(m => m.id !== id))
    setDeleteId(null)
  }

  const exportCsv = () => {
    const header = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date']
    const rows = messages.map(m => [
      m.name, m.email, m.phone || '', m.subject || '', m.message, m.status,
      new Date(m.created_at).toLocaleDateString(),
    ])
    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const newCount = messages.filter(m => m.status === 'new').length

  return (
    <>
      <Topbar title="Messages" />
      <div style={{ padding: 24 }}>
        <div className="cms-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MessageSquare size={18} color="#8B6914" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
              {messages.length} Messages{newCount > 0 ? ` · ${newCount} new` : ''}
            </span>
          </div>
          <button onClick={exportCsv} disabled={messages.length === 0} className="btn btn-primary btn-sm">
            <DownloadIcon size={13} /> Export CSV
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading messages…</p>
        ) : messages.length === 0 ? (
          <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <MessageSquare size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No messages yet — submissions from the contact form will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map(m => {
              const cfg = STATUS_CFG[m.status] || STATUS_CFG.new
              return (
                <div key={m.id} className="cms-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{m.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, fontSize: 12, color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{m.email}</span>
                        {m.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{m.phone}</span>}
                        <span>{new Date(m.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {m.status !== 'replied' && (
                        <button onClick={() => updateStatus(m.id, 'replied')} className="btn btn-ghost btn-sm" title="Mark as replied">
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      <button onClick={() => setDeleteId(m.id)} className="btn btn-ghost btn-sm" title="Delete">
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                  {m.subject && (
                    <p style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: '#334155' }}>{m.subject}</p>
                  )}
                  <p style={{ marginTop: 6, fontSize: 13, color: '#475569', whiteSpace: 'pre-wrap' }}>{m.message}</p>

                  {deleteId === m.id && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#991b1b' }}>Delete this message permanently?</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setDeleteId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                        <button onClick={() => remove(m.id)} className="btn btn-sm" style={{ background: '#dc2626', color: '#fff' }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
