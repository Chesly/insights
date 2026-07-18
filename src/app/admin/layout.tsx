export const dynamic = 'force-dynamic'

import Sidebar from '@/components/layout/Sidebar'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cms-shell">
      <div className="cms-topbar-accent" />
      <div className="cms-body-row">
        <Sidebar />
        <div className="cms-main">{children}</div>
      </div>
      <footer className="cms-footer-bar">
        © {new Date().getFullYear()} Chesly CMS V1.0 • <a href="https://chesly.tech" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', margin: '0 4px' }}>Chesly.Tech</a> • Support: <a href="mailto:hello@chesly.tech" style={{ color: 'inherit', textDecoration: 'underline', marginLeft: 4 }}>hello@chesly.tech</a>
      </footer>
    </div>
  )
}
