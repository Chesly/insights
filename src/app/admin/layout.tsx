export const dynamic = 'force-dynamic'

import Sidebar from '@/components/layout/Sidebar'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="cms-main" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>{children}</div>
        <footer style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 400,
          lineHeight: 1.5,
          color: '#141821',
          textAlign: 'center',
          padding: '14px 0',
        }}>
          © {new Date().getFullYear()} Chesly CMS V1.0 • <a href="https://chesly.tech" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Chesly.Tech</a> • Support: <a href="mailto:hello@chesly.tech" style={{ color: 'inherit', textDecoration: 'underline' }}>hello@chesly.tech</a>
        </footer>
      </div>
    </div>
  )
}
