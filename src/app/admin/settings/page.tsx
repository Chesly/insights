"use client"
import { useState, useEffect, useCallback } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'

const SECTIONS = [
  {
    id: 'site', label: 'Site Identity',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Chesly.Tech Insights' },
      { key: 'site_url', label: 'Site URL', type: 'url', placeholder: 'https://chesly.tech' },
      { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'AI. Websites. Design. Growth.' },
      { key: 'contact_email', label: 'Contact Email', type: 'email', placeholder: 'hello@chesly.tech' },
    ]
  },
  {
    id: 'tracking', label: 'Tracking & Analytics',
    fields: [
      { key: 'google_tag_manager', label: 'Google Tag Manager Container ID', type: 'text', placeholder: 'GTM-XXXXXXX',
        help: 'The one ID that runs everything — once set, add Meta Pixel, LinkedIn, TikTok, or anything else inside your GTM dashboard. No further code changes needed.' },
    ]
  },
  {
    id: 'imagekit', label: 'ImageKit CDN',
    fields: [
      { key: 'imagekit_endpoint', label: 'URL Endpoint', type: 'url', placeholder: 'https://ik.imagekit.io/mkvu8hdr5' },
      { key: 'imagekit_public_key', label: 'Public Key', type: 'text', placeholder: 'public_…' },
    ]
  },
  {
    id: 'seo', label: 'Default SEO',
    fields: [
      { key: 'default_og_image', label: 'Default OG Image URL', type: 'url', placeholder: 'https://ik.imagekit.io/mkvu8hdr5/og-default.jpg' },
    ]
  },
  {
    id: 'newsletter', label: 'Newsletter',
    fields: [
      { key: 'newsletter_name', label: 'Newsletter Name', type: 'text', placeholder: 'The Chesly.Tech Growth Letter' },
      { key: 'newsletter_from_name', label: 'From Name', type: 'text', placeholder: 'Chesly Silaule' },
      { key: 'newsletter_from_email', label: 'From Email', type: 'email', placeholder: 'hello@chesly.tech' },
    ]
  },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const json = await res.json()
      setValues(json.data || {})
    } catch { setError('Could not load settings') }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Save failed') }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
    setSaving(false)
  }

  return (
    <>
      <Topbar title="Settings"/>
      <div style={{ padding: 24, maxWidth: 760 }}>

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            <AlertCircle size={16} />{error}
          </div>
        )}

        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading settings…</p>
        ) : (
          <>
            {SECTIONS.map(section => (
              <div key={section.id} className="cms-card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>{section.label}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {section.fields.map(field => (
                    <div key={field.key}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{field.label}</label>
                      <input
                        className="cms-input"
                        type={field.type}
                        value={values[field.key] || ''}
                        onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                      />
                      {'help' in field && field.help && (
                        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{field.help}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Vercel cron setup */}
            <div className="cms-card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 12 }}>Scheduling (Vercel Cron)</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14, lineHeight: 1.7 }}>
                Add this to your <code style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>vercel.json</code> to auto-publish scheduled posts every 5 minutes:
              </p>
              <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: '14px 16px', borderRadius: 10, fontSize: 12, fontFamily: 'JetBrains Mono,monospace', overflow: 'auto' }}>{`{
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "*/5 * * * *"
    }
  ]
}`}</pre>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>Set <code style={{ fontFamily: 'monospace', fontSize: 11 }}>CRON_SECRET</code> in Vercel environment variables for security.</p>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ minWidth: 160, justifyContent: 'center' }}>
              {saved ? <><CheckCircle size={14}/>Saved!</> : saving ? 'Saving…' : <><Save size={14}/>Save Settings</>}
            </button>
          </>
        )}
      </div>
    </>
  )
}
