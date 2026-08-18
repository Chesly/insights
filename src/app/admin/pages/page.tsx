import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import Link from 'next/link'
import { Edit2, ExternalLink, Globe } from 'lucide-react'

export default async function PagesListPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, slug, status, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <>
      <Topbar title="Pages" action={{ label: 'New Page', href: '/admin/pages/new' }} />
      <div style={{ padding: 24 }}>
        <div className="cms-card">
          {(!pages || pages.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Globe size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>No pages yet.</p>
              <Link href="/admin/pages/new" className="btn btn-primary btn-sm">Create your first page →</Link>
            </div>
          ) : (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/pages/${p.id}`} style={{ fontWeight: 600, color: '#1e293b', textDecoration: 'none', fontSize: 13.5 }}>
                        {p.title}
                      </Link>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>/{p.slug}</div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                        background: p.status === 'published' ? '#d1fae5' : '#f1f5f9',
                        color: p.status === 'published' ? '#065f46' : '#64748b',
                      }}>
                        {p.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(p.updated_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Link href={`/admin/pages/${p.id}`} className="btn btn-ghost btn-sm" style={{ padding: '5px' }} title="Edit"><Edit2 size={13} /></Link>
                        {p.status === 'published' && (
                          <a href={`https://insights.chesly.tech/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ padding: '5px', color: '#94a3b8' }} title="View live">
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
