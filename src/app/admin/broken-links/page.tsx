"use client"
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Link2Off, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react'

interface LinkCheck {
  url: string
  status: number | null
  reason: string
}

interface PostResult {
  id: string
  title: string
  slug: string
  section: string
  brokenLinks: LinkCheck[]
}

interface ScanResponse {
  scannedAt: string
  postsScanned: number
  linksChecked: number
  linksSkipped: number
  postsWithBrokenLinks: number
  results: PostResult[]
}

export default function BrokenLinksPage() {
  const [scanning, setScanning] = useState(false)
  const [data, setData] = useState<ScanResponse | null>(null)
  const [error, setError] = useState('')

  const scan = async () => {
    setScanning(true)
    setError('')
    try {
      const res = await fetch('/api/admin/check-links', { method: 'POST' })
      if (!res.ok) throw new Error('Scan failed')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Scan failed — try again.')
    }
    setScanning(false)
  }

  return (
    <>
      <Topbar title="Broken Links" />
      <div style={{ padding: 24 }}>
        <div className="cms-card" style={{ padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 13.5, color: '#374151', fontWeight: 600, marginBottom: 4 }}>
              Scan every post for dead links
            </p>
            <p style={{ fontSize: 12.5, color: '#94a3b8' }}>
              Checks every link inside published article content and reports any that return an error or don&rsquo;t respond. Some hosts block automated checks — treat results as a starting point, not certainty.
            </p>
          </div>
          <button onClick={scan} disabled={scanning} className="btn" style={{ background: '#1e293b', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <RefreshCw size={14} className={scanning ? 'spin' : ''} />
            {scanning ? 'Scanning…' : 'Scan All Posts'}
          </button>
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

        {data && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <Stat label="Posts Scanned" value={data.postsScanned} />
              <Stat label="Links Checked" value={data.linksChecked} />
              <Stat label="Posts With Broken Links" value={data.postsWithBrokenLinks} tone={data.postsWithBrokenLinks > 0 ? 'bad' : 'good'} />
              {data.linksSkipped > 0 && <Stat label="Skipped (ran out of time)" value={data.linksSkipped} />}
            </div>

            {data.linksSkipped > 0 && (
              <p style={{ fontSize: 12.5, color: '#b45309', marginBottom: 16 }}>
                The hosting plan caps each scan to a few seconds, so {data.linksSkipped} link{data.linksSkipped === 1 ? '' : 's'} didn&rsquo;t get checked this run. Click &ldquo;Scan All Posts&rdquo; again to pick up more — results aren&rsquo;t cumulative, so re-scanning is the way to eventually cover everything.
              </p>
            )}

            {data.results.length === 0 ? (
              <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Link2Off size={32} color="#22c55e" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#64748b', fontSize: 14 }}>No broken links found.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.results.map((post) => (
                  <div key={post.id} className="cms-card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1e293b' }}>{post.title}</span>
                      <a
                        href={`/${post.section === 'coffee' ? 'coffee' : 'insights'}/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#8B6914', whiteSpace: 'nowrap' }}
                      >
                        View post <ExternalLink size={11} />
                      </a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {post.brokenLinks.map((link, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#374151', background: '#fef2f2', border: '1px solid #fecaca', padding: '6px 10px' }}>
                          <AlertTriangle size={13} color="#dc2626" style={{ flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: '#dc2626', flexShrink: 0 }}>{link.reason}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!data && !scanning && (
          <div className="cms-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Link2Off size={32} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Run a scan to check every post for dead links.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'good' | 'bad' }) {
  const color = tone === 'bad' && value > 0 ? '#dc2626' : tone === 'good' ? '#16a34a' : '#1e293b'
  return (
    <div className="cms-card" style={{ padding: '14px 20px', minWidth: 140 }}>
      <p style={{ fontSize: 22, fontWeight: 800, color }}>{value}</p>
      <p style={{ fontSize: 11.5, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</p>
    </div>
  )
}
