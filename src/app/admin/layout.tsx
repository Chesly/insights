export const dynamic = 'force-dynamic'

import Sidebar from '@/components/layout/Sidebar'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="cms-main">
        {children}
      </div>
    </div>
  )
}
