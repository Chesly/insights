"use client"
import { Bell, Search, Plus } from 'lucide-react'
import Link from 'next/link'

interface Props { title: string; action?: { label: string; href: string } }

export default function Topbar({ title, action }: Props) {
  return (
    <div className="cms-topbar">
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 18, color: '#1e293b', flex: 1 }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}><Search size={16}/></button>
        <button className="btn btn-ghost btn-sm" style={{ padding: '6px', position: 'relative' }}>
          <Bell size={16}/>
          <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: '#8B6914', border: '2px solid #fff' }}/>
        </button>
        {action && (
          <Link href={action.href} className="btn btn-primary btn-sm">
            <Plus size={14}/>{action.label}
          </Link>
        )}
      </div>
    </div>
  )
}
