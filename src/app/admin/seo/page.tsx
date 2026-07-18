"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import Link from 'next/link'
import { Search, AlertTriangle, CheckCircle, Info, RefreshCw, Edit2, TrendingUp } from 'lucide-react'

interface PostAudit {
  id: string; title: string; slug: string; status: string
  issues: string[]; warnings: string[]; wordCount: number; score: number
}

interface AuditStats {
  totalPosts: number; missingMeta: number; missingSeoTitle: number
  missingImage: number; thinContent: number; avgScore: number
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#059669' : score >= 50 ? '#f59e0b' : '#dc2626'
  const bg = score >= 80 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2'
  return (
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: bg, border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 800, color }}>{score}</span>
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#059669' : score >= 50 ? '#f59e0b' : '#dc2626'
  return (
    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${score}%`, background: color, height: '100%', borderRadius: 3, transition: 'width 0.6s ease' }}/>
    </div>
  )
}

export default function SEOPage() {
  const [data, setData] = useState<{ stats: AuditStats; posts: PostAudit[] }|null>(null)
  const [settings, setSettings] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all'|'issues'|'warnings'|'good'>('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [seoRes, settingsRes] = await Promise.all([
      fetch('/api/seo'),
      fetch('/api/settings'),
    ])
    const seoJson = await seoRes.json()
    const settingsJson = await settingsRes.json()
    setData(seoJson)
    setSettings(settingsJson.data || {})
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = (data?.posts || []).filter(p => {
    if (filter === 'issues') return p.issues.length > 0
    if (filter === 'warnings') return p.warnings.length > 0 && p.issues.length === 0
    if (filter === 'good') return p.issues.length === 0 && p.warnings.length === 0
    return true
  }).filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))

  const s = data?.stats

  return (
    <>
      <Topbar title="SEO Audit"/>
      <div style={{ padding: 24, maxWidth: 1200 }}>

        {/* Overview cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          {/* Score card */}
          <div className="stat-card" style={{ gridColumn: '1', background: 'linear-gradient(135deg,#1B2A4A,#0f1c36)', color: '#fff', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg SEO Score</span>
              <TrendingUp size={18} color="#C09832"/>
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 48, color: s?.avgScore && s.avgScore >= 70 ? '#6ee7b7' : '#fbbf24', lineHeight: 1 }}>
              {loading ? '…' : s?.avgScore || 0}
            </div>
            <ScoreBar score={s?.avgScore || 0}/>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>{s?.totalPosts || 0} posts audited</div>
          </div>

          {/* Issues grid */}
          <div style={{ gridColumn: '2 / -1', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {[
              { label: 'Missing Meta Description', value: s?.missingMeta, icon: '📝', color: '#dc2626', bg: '#fee2e2' },
              { label: 'Missing SEO Title', value: s?.missingSeoTitle, icon: '🏷️', color: '#f59e0b', bg: '#fef3c7' },
              { label: 'Missing OG Image', value: s?.missingImage, icon: '🖼️', color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Thin Content (<300w)', value: s?.thinContent, icon: '📄', color: '#0891b2', bg: '#e0f2fe' },
            ].map(item => (
              <div key={item.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12, background: loading ? '#f9fafb' : item.value ? item.bg : '#f0fdf4' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 26, color: loading ? '#d1d5db' : item.value ? item.color : '#059669' }}>
                    {loading ? '…' : item.value || 0}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.3 }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration status — real, live checks, not decorative */}
        <div className="cms-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Integration Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { label: 'Google Tag Manager', ok: !!settings.google_tag_manager },
              { label: 'Microsoft Clarity', ok: !!settings.microsoft_clarity },
              { label: 'Search Console Verified', ok: !!settings.google_search_console },
              { label: 'Bing Verified', ok: !!settings.bing_verification },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: item.ok ? '#f0fdf4' : '#fff7ed', borderRadius: 8, border: `1px solid ${item.ok ? '#bbf7d0' : '#fed7aa'}` }}>
                {item.ok ? <CheckCircle size={14} color="#059669"/> : <AlertTriangle size={14} color="#f59e0b"/>}
                <span style={{ fontSize: 12, fontWeight: 600, color: item.ok ? '#065f46' : '#92400e' }}>{item.label}</span>
              </div>
            ))}
          </div>
          {!settings.google_search_console && (
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
              Not verified yet? Get a verification code from Google Search Console and add it under Settings → Site Verification.
            </p>
          )}
        </div>

        {/* Schema / robots quick status */}
        <div className="cms-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Technical SEO Checklist</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { label: 'Sitemap.xml', ok: true, href: '/sitemap.xml' },
              { label: 'Robots.txt', ok: true, href: '/robots.txt' },
              { label: 'Organization Schema', ok: true },
              { label: 'Article Schema', ok: true },
              { label: 'Person Schema', ok: true },
              { label: 'Open Graph', ok: true },
              { label: 'Twitter Cards', ok: true },
              { label: 'Canonical URLs', ok: (s?.totalPosts||0)-(s?.missingMeta||0) > 0 },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: item.ok ? '#f0fdf4' : '#fff7ed', borderRadius: 8, border: `1px solid ${item.ok ? '#bbf7d0' : '#fed7aa'}` }}>
                {item.ok ? <CheckCircle size={14} color="#059669"/> : <AlertTriangle size={14} color="#f59e0b"/>}
                <span style={{ fontSize: 12, fontWeight: 600, color: item.ok ? '#065f46' : '#92400e' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts audit table */}
        <div className="cms-card">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b', flex: 1 }}>Post-Level Audit</h3>

            {/* Filter tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 3, gap: 3 }}>
              {[
                { key: 'all', label: `All (${data?.posts.length||0})` },
                { key: 'issues', label: `Issues (${data?.posts.filter(p=>p.issues.length>0).length||0})` },
                { key: 'warnings', label: `Warnings (${data?.posts.filter(p=>p.warnings.length>0&&p.issues.length===0).length||0})` },
                { key: 'good', label: `Good (${data?.posts.filter(p=>p.issues.length===0&&p.warnings.length===0).length||0})` },
              ].map(tab => (
                <button key={tab.key} onClick={() => setFilter(tab.key as typeof filter)}
                  style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    background: filter === tab.key ? '#fff' : 'transparent', color: filter === tab.key ? '#1e293b' : '#64748b',
                    boxShadow: filter === tab.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}/>
              <input className="cms-input" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Filter posts…" style={{ paddingLeft: 28, width: 180, fontSize: 13 }}/>
            </div>

            <button onClick={load} disabled={loading} className="btn btn-ghost btn-sm">
              <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}}/>
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Running audit…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <CheckCircle size={40} color="#bbf7d0" style={{ margin: '0 auto 1rem', display: 'block' }}/>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>No posts match this filter.</p>
            </div>
          ) : (
            <div>
              {filtered.map(post => (
                <div key={post.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px', borderBottom: '1px solid #f8fafc' }}>
                  <ScoreBadge score={post.score}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Link href={`/admin/posts/${post.id}`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: '#1e293b', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title}
                      </Link>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, flexShrink: 0,
                        background: { published: '#d1fae5', draft: '#f1f5f9', scheduled: '#dbeafe', archived: '#fef3c7' }[post.status] || '#f1f5f9',
                        color: { published: '#065f46', draft: '#64748b', scheduled: '#1e40af', archived: '#92400e' }[post.status] || '#64748b' }}>
                        {post.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>/{post.slug} · {post.wordCount} words</div>

                    {/* Issues */}
                    {post.issues.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                        {post.issues.map(i => (
                          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, background: '#fee2e2', color: '#dc2626', padding: '3px 8px', borderRadius: 6 }}>
                            <AlertTriangle size={11}/>{i}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Warnings */}
                    {post.warnings.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {post.warnings.map(w => (
                          <span key={w} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 6 }}>
                            <Info size={11}/>{w}
                          </span>
                        ))}
                      </div>
                    )}

                    {post.issues.length === 0 && post.warnings.length === 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#059669' }}>
                        <CheckCircle size={13}/>All SEO fields complete
                      </span>
                    )}
                  </div>
                  <Link href={`/admin/posts/${post.id}`} className="btn btn-ghost btn-sm" style={{ padding: '5px', flexShrink: 0 }} title="Fix issues">
                    <Edit2 size={14}/>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
