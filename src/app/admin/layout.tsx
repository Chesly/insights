import Sidebar from '@/components/layout/Sidebar'

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
