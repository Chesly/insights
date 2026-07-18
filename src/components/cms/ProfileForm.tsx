"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'

interface Profile {
  id: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  bio?: string | null
}

export default function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
  const [firstName, setFirstName] = useState(profile?.first_name || '')
  const [lastName, setLastName] = useState(profile?.last_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const { error: err } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        phone,
      })
      .eq('id', profile?.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="cms-card" style={{ padding: 24 }}>
      {error && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Name</label>
          <input className="cms-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Chesly" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Surname</label>
          <input className="cms-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Silaule" />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Email (username)</label>
        <input className="cms-input" value={email} disabled style={{ background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }} />
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Your email is your login username and can&apos;t be changed here.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Contact Number</label>
        <input className="cms-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 12 345 6789" />
      </div>

      <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ minWidth: 160, justifyContent: 'center' }}>
        {saved ? <><CheckCircle size={14} />Saved!</> : saving ? 'Saving…' : <><Save size={14} />Save Profile</>}
      </button>
    </div>
  )
}
