"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, FileText, FolderOpen, Image, Download,
  Mail, MessageSquare, Search, Settings, Users, LogOut,
  ChevronRight, Globe, Tag
} from 'lucide-react'

const NAV = [
  { group: 'Content', items: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Posts', href: '/admin/posts', icon: FileText, badge: 'new' },
    { label: 'Pages', href: '/admin/pages', icon: Globe },
    { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { label: 'Tags', href: '/admin/tags', icon: Tag },
  ]},
  { group: 'Assets', items: [
    { label: 'Media Library', href: '/admin/media', icon: Image },
    { label: 'Downloads', href: '/admin/downloads', icon: Download },
  ]},
  { group: 'Audience', items: [
    { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    { label: 'Comments', href: '/admin/comments', icon: MessageSquare },
  ]},
  { group: 'System', items: [
    { label: 'SEO', href: '/admin/seo', icon: Search },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Users', href: '/admin/users', icon: Users },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/ct-login')
  }

  const isActive = (href: string) =>
    href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="cms-sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C09832,#8B6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0 }}>CT</div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9', lineHeight: 1 }}>Chesly CMS</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Content Platform</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV.map(group => (
          <div key={group.group}>
            <div className="nav-group-label">{group.group}</div>
            {group.items.map(item => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}>
                  <Icon size={15} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: 9, fontWeight: 700, background: '#8B6914', color: '#fff', padding: '2px 6px', borderRadius: 999, textTransform: 'uppercase' }}>{item.badge}</span>
                  )}
                  {active && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={signOut} className="nav-item" style={{ color: '#ef4444' }}>
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
