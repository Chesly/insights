"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Check, X, Phone, Mail, Users as UsersIcon, RotateCcw } from 'lucide-react'

interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
] as const

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<typeof TABS[number]['id']>('pending')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setUsers(json.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const counts = {
    pending: users.filter(u => u.status === 'pending').length,
    approved: users.filter(u => u.status === 'approved').length,
    rejected: users.filter(u => u.status === 'rejected').length,
    all: users.length,
  }

  const filtered = tab === 'all' ? users : users.filter(u => u.status === tab)

  const setStatus = async (id: string, status: Profile['status']) => {
    setBusyId(id)
    const prev = users
    setUsers(u => u.map(x => x.id === id ? { ...x, status } : x))
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setUsers(prev)
    }
    setBusyId(null)
  }

  return (
    <>
      <Topbar title="Users" />
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

        {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading users…</p>
        ) : filtered.length === 0 ? (
          <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <UsersIcon size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No {tab === 'all' ? '' : tab} users.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(u => (
              <div key={u.id} className="cms-card" style={{ padding: 18, opacity: busyId === u.id ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {u.avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={u.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <UsersIcon size={18} color="#cbd5e1" />
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1e293b' }}>
                          {u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Unnamed'}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: '#8B6914', background: '#fef3c7', padding: '1px 6px', borderRadius: 4 }}>
                          {u.role}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{u.email}</span>
                        {u.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{u.phone}</span>}
                      </div>
                      <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
                        Registered {new Date(u.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {u.status !== 'approved' && (
                      <button title="Approve" onClick={() => setStatus(u.id, 'approved')} className="btn btn-sm" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        <Check size={14} />
                      </button>
                    )}
                    {u.status !== 'rejected' && (
                      <button title="Reject" onClick={() => setStatus(u.id, 'rejected')} className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                        <X size={14} />
                      </button>
                    )}
                    {u.status !== 'pending' && (
                      <button title="Reset to pending" onClick={() => setStatus(u.id, 'pending')} className="btn btn-sm" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        <RotateCcw size={14} />
                      </button>
                    )}
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
