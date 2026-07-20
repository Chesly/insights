"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Download as DownloadIcon, Mail, Phone, Users } from 'lucide-react'

interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  whatsapp: string
  created_at: string
  access_count: number
  last_accessed_at: string
  download?: { name: string } | null
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      const json = await res.json()
      setLeads(json.data || [])
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const exportCsv = () => {
    const header = ['First Name', 'Surname', 'Email', 'WhatsApp', 'Download', 'Requests', 'Date']
    const rows = leads.map(l => [
      l.first_name, l.last_name, l.email, l.whatsapp,
      l.download?.name || '', l.access_count, new Date(l.created_at).toLocaleDateString(),
    ])
    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Topbar title="Leads" />
      <div style={{ padding: 24 }}>
        <div className="cms-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={18} color="#8B6914" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{leads.length} Leads Captured</span>
          </div>
          <button onClick={exportCsv} disabled={leads.length === 0} className="btn btn-primary btn-sm">
            <DownloadIcon size={13} /> Export CSV
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading leads…</p>
        ) : leads.length === 0 ? (
          <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Users size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No leads yet — they&apos;ll appear here when someone unlocks a premium download.</p>
          </div>
        ) : (
          <div className="cms-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '10px 16px', fontWeight: 700, color: '#64748b' }}>Name</th>
                  <th style={{ padding: '10px 16px', fontWeight: 700, color: '#64748b' }}>Contact</th>
                  <th style={{ padding: '10px 16px', fontWeight: 700, color: '#64748b' }}>Download</th>
                  <th style={{ padding: '10px 16px', fontWeight: 700, color: '#64748b' }}>Requests</th>
                  <th style={{ padding: '10px 16px', fontWeight: 700, color: '#64748b' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(l => (
                  <tr key={l.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1e293b' }}>{l.first_name} {l.last_name}</td>
                    <td style={{ padding: '10px 16px', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}><Mail size={11} />{l.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} />{l.whatsapp}</div>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#64748b' }}>{l.download?.name || '—'}</td>
                    <td style={{ padding: '10px 16px' }}>
                      {l.access_count > 1 ? (
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#fefce8', color: '#8B6914', padding: '2px 8px', borderRadius: 999 }}>
                          {l.access_count}× repeat
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>1</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#94a3b8' }}>{new Date(l.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
