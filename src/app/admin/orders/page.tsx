import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import Topbar from '@/components/layout/Topbar'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'
import { invoiceNumber } from '@/lib/invoice'

const STATUS_STYLE: Record<string, { background: string; color: string }> = {
  paid: { background: '#f0fdf4', color: '#16a34a' },
  pending: { background: '#fefce8', color: '#8B6914' },
  failed: { background: '#fee2e2', color: '#dc2626' },
}

export default async function OrdersPage() {
  const session = await getSessionProfile()
  const allowed = !session || isAllowedElevatedAccess(session)

  // orders holds customer PII/payment data and (per lib/orders.ts and the
  // checkout routes) is only ever read via the service client — RLS on
  // this table isn't set up to allow the regular session-cookie client.
  const supabase = createServiceClient()
  const { data: orders } = allowed
    ? await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200)
    : { data: null }

  return (
    <>
      <Topbar title="Orders"/>
      <div style={{ padding: 24, maxWidth: 1100 }}>
        {!allowed ? (
          <div className="cms-card" style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
            Orders contain customer payment details — only admins can view them.
          </div>
        ) : (
          <div className="cms-card">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(orders || []).length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No orders yet.</td></tr>
                )}
                {(orders || []).map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{invoiceNumber({ id: o.id, createdAt: o.created_at })}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer_name || '—'}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{o.customer_email}</div>
                    </td>
                    <td style={{ fontSize: 12, maxWidth: 240 }}>{(o.items || []).map((i: { name: string }) => i.name).join(', ')}</td>
                    <td style={{ fontWeight: 700, fontSize: 13 }}>R{Number(o.amount).toFixed(2)}</td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, ...(STATUS_STYLE[o.status] || {}) }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{new Date(o.created_at).toLocaleDateString('en-ZA', { day:'numeric', month:'short', year:'numeric' })}</td>
                    <td>
                      <Link href={`/invoice/${o.paystack_reference}`} target="_blank" style={{ fontSize: 12, fontWeight: 600, color: '#8B6914' }}>
                        View →
                      </Link>
                    </td>
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
