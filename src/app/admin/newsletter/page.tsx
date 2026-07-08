"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import {
  Mail, Search, Download, Plus, Trash2, UserCheck,
  UserX, RefreshCw, X, AlertCircle, Users, TrendingUp, CheckCircle
} from 'lucide-react'
import type { NewsletterSubscriber } from '@/types'

const SEGMENTS = ['general','ai','seo','business','design','all']
const STATUS_CFG: Record<string, { label: string; bg: string; color: string }> = {
  active:       { label:'Active',        bg:'#d1fae5', color:'#065f46' },
  unsubscribed: { label:'Unsubscribed',  bg:'#fee2e2', color:'#991b1b' },
  bounced:      { label:'Bounced',       bg:'#fef3c7', color:'#92400e' },
}

export default function NewsletterPage() {
  const [subs, setSubs] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('active')
  const [segmentFilter, setSegmentFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newSegment, setNewSegment] = useState('general')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [exporting, setExporting] = useState(false)
  const [stats, setStats] = useState({ active:0, unsubscribed:0, bounced:0, total:0 })

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/newsletter?limit=1')
    const all = await res.json()
    const [aRes, uRes, bRes] = await Promise.all([
      fetch('/api/newsletter?status=active&limit=1'),
      fetch('/api/newsletter?status=unsubscribed&limit=1'),
      fetch('/api/newsletter?status=bounced&limit=1'),
    ])
    const [a, u, b] = await Promise.all([aRes.json(), uRes.json(), bRes.json()])
    setStats({ active: a.count||0, unsubscribed: u.count||0, bounced: b.count||0, total: all.count||0 })
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      status: statusFilter, page: String(page), limit: '50',
      ...(segmentFilter ? { segment: segmentFilter } : {}),
      ...(search ? { search } : {}),
    })
    const res = await fetch(`/api/newsletter?${params}`)
    const json = await res.json()
    setSubs(json.data || [])
    setTotal(json.count || 0)
    setLoading(false)
  }, [statusFilter, segmentFilter, search, page])

  useEffect(() => { load(); loadStats() }, [load, loadStats])

  const addSubscriber = async () => {
    if (!newEmail.trim()) { setError('Email is required'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, full_name: newName, segment: newSegment, source: 'admin' })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setShowAdd(false); setNewEmail(''); setNewName(''); setNewSegment('general')
      await load(); await loadStats()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/newsletter/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(status === 'unsubscribed' ? { unsubscribed_at: new Date().toISOString() } : {}) })
    })
    await load(); await loadStats()
  }

  const del = async (id: string) => {
    setSaving(true)
    try {
      await fetch(`/api/newsletter/${id}`, { method: 'DELETE' })
      setDeleteId(null); await load(); await loadStats()
    } finally { setSaving(false) }
  }

  const exportCsv = async () => {
    setExporting(true)
    const params = new URLSearchParams({ status: statusFilter, ...(segmentFilter ? { segment: segmentFilter } : {}) })
    const res = await fetch(`/api/newsletter/export?${params}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `subscribers-${statusFilter}-${new Date().toISOString().split('T')[0]}.csv`
    a.click(); URL.revokeObjectURL(url)
    setExporting(false)
  }

  const totalPages = Math.ceil(total / 50)

  return (
    <>
      <Topbar title="Newsletter Subscribers"/>
      <div style={{ padding: 24, maxWidth: 1200 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total', value: stats.total, icon: Users, color: '#1B2A4A' },
            { label: 'Active', value: stats.active, icon: CheckCircle, color: '#059669' },
            { label: 'Unsubscribed', value: stats.unsubscribed, icon: UserX, color: '#dc2626' },
            { label: 'Bounced', value: stats.bounced, icon: Mail, color: '#f59e0b' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={s.color}/>
                </div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, color: '#1e293b' }}>{s.value.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Growth bar */}
        {stats.total > 0 && (
          <div className="cms-card" style={{ padding: '14px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} color="#8B6914"/>Subscriber Health</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{Math.round((stats.active/stats.total)*100)}% active</span>
            </div>
            <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${(stats.active/stats.total)*100}%`, background: '#059669', transition: 'width 0.5s' }}/>
              <div style={{ width: `${(stats.unsubscribed/stats.total)*100}%`, background: '#dc2626' }}/>
              <div style={{ width: `${(stats.bounced/stats.total)*100}%`, background: '#f59e0b' }}/>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              {[['#059669','Active'],['#dc2626','Unsub'],['#f59e0b','Bounced']].map(([c,l])=>(
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }}/>
                  {l}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, gap: 4 }}>
            {['active','unsubscribed','bounced'].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
                style={{ padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                  background: statusFilter === s ? '#fff' : 'transparent', color: statusFilter === s ? '#1e293b' : '#64748b',
                  boxShadow: statusFilter === s ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Segment filter */}
          <select className="cms-input cms-select" value={segmentFilter} onChange={e => { setSegmentFilter(e.target.value); setPage(1) }} style={{ width: 150, fontSize: 13 }}>
            <option value="">All Segments</option>
            {SEGMENTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}/>
            <input className="cms-input" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by email…" style={{ paddingLeft: 30, fontSize: 13 }}/>
          </div>

          <span style={{ fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>{total.toLocaleString()} subscriber{total !== 1 ? 's' : ''}</span>

          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button onClick={exportCsv} disabled={exporting} className="btn btn-secondary btn-sm">
              <Download size={13}/>{exporting ? 'Exporting…' : 'Export CSV'}
            </button>
            <button onClick={() => setShowAdd(true)} className="btn btn-primary btn-sm">
              <Plus size={13}/>Add Subscriber
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="cms-card">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Loading subscribers…</div>
          ) : subs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Mail size={40} color="#e2e8f0" style={{ margin: '0 auto 1rem', display: 'block' }}/>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>No subscribers found.</p>
            </div>
          ) : (
            <table className="cms-table">
              <thead>
                <tr><th>Email</th><th>Name</th><th>Segment</th><th>Source</th><th>Status</th><th>Subscribed</th><th style={{ width: 100 }}>Actions</th></tr>
              </thead>
              <tbody>
                {subs.map(sub => {
                  const sc = STATUS_CFG[sub.status] || STATUS_CFG.active
                  return (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 600, fontSize: 13.5, color: '#1e293b' }}>{sub.email}</td>
                      <td style={{ fontSize: 13, color: '#64748b' }}>{sub.full_name || <span style={{ color: '#d1d5db' }}>—</span>}</td>
                      <td>
                        <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(139,105,20,0.1)', color: '#8B6914', padding: '2px 8px', borderRadius: 999, textTransform: 'capitalize' }}>
                          {sub.segment}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: '#94a3b8' }}>{sub.source}</td>
                      <td>
                        <span style={{ fontSize: 11.5, fontWeight: 700, background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 999 }}>{sc.label}</span>
                      </td>
                      <td style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {new Date(sub.subscribed_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {sub.status === 'active' && (
                            <button onClick={() => updateStatus(sub.id, 'unsubscribed')} className="btn btn-ghost btn-sm" style={{ padding: '5px', color: '#f59e0b' }} title="Unsubscribe">
                              <UserX size={13}/>
                            </button>
                          )}
                          {sub.status !== 'active' && (
                            <button onClick={() => updateStatus(sub.id, 'active')} className="btn btn-ghost btn-sm" style={{ padding: '5px', color: '#059669' }} title="Reactivate">
                              <UserCheck size={13}/>
                            </button>
                          )}
                          <button onClick={() => setDeleteId(sub.id)} className="btn btn-ghost btn-sm" style={{ padding: '5px', color: '#ef4444' }} title="Delete">
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn btn-secondary btn-sm">← Prev</button>
            <span style={{ padding: '5px 14px', fontSize: 13, color: '#64748b', alignSelf: 'center' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="btn btn-secondary btn-sm">Next →</button>
          </div>
        )}
      </div>

      {/* Add subscriber modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 440, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Add Subscriber</h3>
              <button onClick={() => { setShowAdd(false); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}><X size={16}/></button>
            </div>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', borderRadius: 8, padding: '10px 12px', marginBottom: 14, color: '#dc2626', fontSize: 13 }}>
                <AlertCircle size={14}/>{error}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Email *</label>
                <input className="cms-input" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="subscriber@email.com"/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Full Name</label>
                <input className="cms-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Optional"/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Segment</label>
                <select className="cms-input cms-select" value={newSegment} onChange={e => setNewSegment(e.target.value)}>
                  {SEGMENTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => { setShowAdd(false); setError('') }} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={addSubscriber} disabled={saving} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Plus size={13}/>{saving ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 380, width: '100%' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 8 }}>Delete Subscriber?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>This permanently removes their record. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={() => del(deleteId)} disabled={saving} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}><Trash2 size={13}/>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
