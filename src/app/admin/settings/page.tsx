"use client"
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Save, CheckCircle } from 'lucide-react'

const SECTIONS = [
  {
    id: 'site', label: 'Site Identity',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Chesly.Tech Insights', value: 'Chesly.Tech Insights' },
      { key: 'site_url', label: 'Site URL', type: 'url', placeholder: 'https://chesly.tech', value: 'https://chesly.tech' },
      { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'AI. Websites. Design. Growth.', value: 'AI. Websites. Design. Growth.' },
      { key: 'contact_email', label: 'Contact Email', type: 'email', placeholder: 'hello@chesly.tech', value: 'hello@chesly.tech' },
    ]
  },
  {
    id: 'imagekit', label: 'ImageKit CDN',
    fields: [
      { key: 'imagekit_endpoint', label: 'URL Endpoint', type: 'url', placeholder: 'https://ik.imagekit.io/mkvu8hdr5', value: 'https://ik.imagekit.io/mkvu8hdr5' },
      { key: 'imagekit_public_key', label: 'Public Key', type: 'text', placeholder: 'public_…', value: '' },
    ]
  },
  {
    id: 'seo', label: 'Default SEO',
    fields: [
      { key: 'default_og_image', label: 'Default OG Image URL', type: 'url', placeholder: 'https://ik.imagekit.io/mkvu8hdr5/og-default.jpg', value: '' },
      { key: 'google_analytics', label: 'GA4 Measurement ID', type: 'text', placeholder: 'G-XXXXXXXXXX', value: '' },
      { key: 'google_tag_manager', label: 'GTM Container ID', type: 'text', placeholder: 'GTM-XXXXXXX', value: '' },
    ]
  },
  {
    id: 'newsletter', label: 'Newsletter',
    fields: [
      { key: 'newsletter_name', label: 'Newsletter Name', type: 'text', placeholder: 'The Chesly.Tech Growth Letter', value: 'The Chesly.Tech Growth Letter' },
      { key: 'newsletter_from_name', label: 'From Name', type: 'text', placeholder: 'Chesly Silaule', value: 'Chesly Silaule' },
      { key: 'newsletter_from_email', label: 'From Email', type: 'email', placeholder: 'hello@chesly.tech', value: 'hello@chesly.tech' },
    ]
  },
]

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <Topbar title="Settings"/>
      <div style={{ padding: 24, maxWidth: 760 }}>

        <div style={{ background: 'linear-gradient(135deg,rgba(139,105,20,0.08),rgba(27,42,74,0.05))', border: '1px solid rgba(139,105,20,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>💡</span>
          Settings are stored in your <code style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>.env.local</code> and Supabase config.
          This UI provides a visual reference and will wire to the database in the next phase.
        </div>

        {SECTIONS.map(section => (
          <div key={section.id} className="cms-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>{section.label}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {section.fields.map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{field.label}</label>
                  <input className="cms-input" type={field.type} defaultValue={field.value} placeholder={field.placeholder}/>
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
      </div>
    </>
  )
}
