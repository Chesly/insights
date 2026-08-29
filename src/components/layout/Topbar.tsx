"use client"
import { useEffect, useRef, useState } from 'react'
import { Bell, Search, Plus, Menu, FileText, Globe, Download as DownloadIcon, Image as ImageIcon, MessageSquare, Star, Mail } from 'lucide-react'
import Link from 'next/link'

interface Props { title: string; action?: { label: string; href: string } }

interface SearchResults {
  posts: { id: string; title: string; slug: string; status: string }[]
  pages: { id: string; title: string; slug: string; status: string }[]
  downloads: { id: string; name: string; slug: string }[]
  media: { id: string; original_name: string; url: string }[]
}

const EMPTY_RESULTS: SearchResults = { posts: [], pages: [], downloads: [], media: [] }

export default function Topbar({ title, action }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS)
  const [searching, setSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [notifOpen, setNotifOpen] = useState(false)
  const [notif, setNotif] = useState({ pendingComments: 0, newMessages: 0, pendingReviews: 0, total: 0 })
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/notifications')
      .then(res => res.json())
      .then(json => { if (typeof json.total === 'number') setNotif(json) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) { setResults(EMPTY_RESULTS); setSearching(false); return }
    setSearching(true)
    const t = setTimeout(() => {
      fetch(`/api/admin/search?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(json => setResults({ ...EMPTY_RESULTS, ...json }))
        .catch(() => setResults(EMPTY_RESULTS))
        .finally(() => setSearching(false))
    }, 250)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSearchOpen(false); setQuery('') }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const hasResults = results.posts.length + results.pages.length + results.downloads.length + results.media.length > 0

  return (
    <div className="cms-topbar">
      <button
        className="btn btn-ghost btn-sm cms-sidebar-toggle"
        style={{ padding: '6px', marginRight: 4 }}
        aria-label="Toggle menu"
        onClick={() => window.dispatchEvent(new Event('admin-toggle-sidebar'))}
      >
        <Menu size={18}/>
      </button>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 18, color: '#1e293b', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Search */}
        <div ref={searchRef} style={{ position: 'relative' }}>
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: 8, padding: '0 8px' }}>
              <Search size={14} color="#94a3b8" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setQuery('') } }}
                placeholder="Search posts, pages, downloads, media…"
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, padding: '7px 8px', width: 220, color: '#1e293b' }}
              />
            </div>
          ) : (
            <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={16}/>
            </button>
          )}

          {searchOpen && query.trim().length >= 2 && (
            <div className="cms-card" style={{ position: 'absolute', top: '110%', right: 0, width: 320, maxHeight: 400, overflowY: 'auto', zIndex: 50, padding: 6 }}>
              {searching ? (
                <p style={{ fontSize: 12, color: '#94a3b8', padding: '10px 8px' }}>Searching…</p>
              ) : !hasResults ? (
                <p style={{ fontSize: 12, color: '#94a3b8', padding: '10px 8px' }}>No matches for &quot;{query}&quot;</p>
              ) : (
                <>
                  <ResultGroup icon={<FileText size={12}/>} label="Posts" items={results.posts.map(p => ({ key: p.id, label: p.title, sub: p.status, href: `/admin/posts/${p.id}` }))} onNavigate={() => setSearchOpen(false)} />
                  <ResultGroup icon={<Globe size={12}/>} label="Pages" items={results.pages.map(p => ({ key: p.id, label: p.title, sub: p.status, href: `/admin/pages/${p.id}` }))} onNavigate={() => setSearchOpen(false)} />
                  <ResultGroup icon={<DownloadIcon size={12}/>} label="Downloads" items={results.downloads.map(d => ({ key: d.id, label: d.name, href: `/admin/downloads` }))} onNavigate={() => setSearchOpen(false)} />
                  <ResultGroup icon={<ImageIcon size={12}/>} label="Media" items={results.media.map(m => ({ key: m.id, label: m.original_name, href: `/admin/media` }))} onNavigate={() => setSearchOpen(false)} />
                </>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', position: 'relative' }}
            aria-label="Notifications"
            onClick={() => setNotifOpen(v => !v)}
          >
            <Bell size={16}/>
            {notif.total > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: '#8B6914', border: '2px solid #fff' }}/>
            )}
          </button>

          {notifOpen && (
            <div className="cms-card" style={{ position: 'absolute', top: '110%', right: 0, width: 260, zIndex: 50, padding: 6 }}>
              {notif.total === 0 ? (
                <p style={{ fontSize: 12, color: '#94a3b8', padding: '10px 8px' }}>Nothing needs your attention.</p>
              ) : (
                <>
                  {notif.pendingComments > 0 && (
                    <NotifRow icon={<MessageSquare size={13}/>} label="Comments awaiting moderation" count={notif.pendingComments} href="/admin/comments" onNavigate={() => setNotifOpen(false)} />
                  )}
                  {notif.newMessages > 0 && (
                    <NotifRow icon={<Mail size={13}/>} label="New contact messages" count={notif.newMessages} href="/admin/messages" onNavigate={() => setNotifOpen(false)} />
                  )}
                  {notif.pendingReviews > 0 && (
                    <NotifRow icon={<Star size={13}/>} label="Reviews awaiting approval" count={notif.pendingReviews} href="/admin/reviews" onNavigate={() => setNotifOpen(false)} />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {action && (
          <Link href={action.href} className="btn btn-primary btn-sm">
            <Plus size={14}/>{action.label}
          </Link>
        )}
      </div>
    </div>
  )
}

function ResultGroup({ icon, label, items, onNavigate }: { icon: React.ReactNode; label: string; items: { key: string; label: string; sub?: string; href: string }[]; onNavigate: () => void }) {
  if (items.length === 0) return null
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '6px 8px 2px' }}>
        {icon}{label}
      </div>
      {items.map(item => (
        <Link
          key={item.key}
          href={item.href}
          onClick={onNavigate}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '7px 8px', borderRadius: 6, fontSize: 13, color: '#1e293b', textDecoration: 'none' }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
          {item.sub && <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0 }}>{item.sub}</span>}
        </Link>
      ))}
    </div>
  )
}

function NotifRow({ icon, label, count, href, onNavigate }: { icon: React.ReactNode; label: string; count: number; href: string; onNavigate: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 8px', borderRadius: 6, fontSize: 13, color: '#1e293b', textDecoration: 'none' }}
    >
      <span style={{ color: '#8B6914' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, background: '#fefce8', color: '#8B6914', padding: '1px 7px', borderRadius: 999 }}>{count}</span>
    </Link>
  )
}
