"use client"
export const dynamic = 'force-dynamic'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, Camera } from 'lucide-react'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [phone, setPhone] = useState('+27 ')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const pickAvatar = (file: File) => {
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('first_name', firstName)
      formData.append('last_name', lastName)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('phone', phone)
      if (avatar) formData.append('avatar', avatar)

      const res = await fetch('/api/auth/register', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Something went wrong. Try again.'); setLoading(false); return }
      setDone(true)
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1B2A4A 50%,#0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://ik.imagekit.io/mkvu8hdr5/insights/Chesly-Tech-Gol-Logo.png" alt="Chesly.Tech logo" style={{ height: 44, margin: '0 auto 1.25rem', display: 'block' }} />
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 19, color: '#f1f5f9', marginBottom: '0.35rem' }}>Become a Contributor</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Register below — an admin will review and approve your account.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 17, color: '#1e293b', marginBottom: '0.5rem' }}>Registration received</h2>
              <p style={{ color: '#64748b', fontSize: 13.5, lineHeight: 1.6 }}>
                Your account is pending admin approval. You&rsquo;ll be able to sign in once it&rsquo;s approved.
              </p>
              <Link href="/ct-login" style={{ display: 'inline-block', marginTop: '1.25rem', fontSize: 13, fontWeight: 600, color: '#8B6914' }}>
                Back to Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem 1rem', color: '#dc2626', fontSize: 13 }}>
                  <AlertCircle size={15} />{error}
                </div>
              )}

              {/* Avatar picker */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
                <button type="button" onClick={() => fileRef.current?.click()} style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', border: '2px dashed #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
                  {avatarPreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Camera size={20} color="#94a3b8" />
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) pickAvatar(f) }} />
              </div>
              <p style={{ textAlign: 'center', fontSize: 11.5, color: '#94a3b8', marginTop: -8 }}>Profile picture (optional)</p>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>First Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" required style={inputStyle} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Surname</label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dlamini" required style={{ ...inputStyle, paddingLeft: 12 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="username" required style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>WhatsApp Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 82 123 4567" required style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" required minLength={8} style={{ ...inputStyle, paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 14, marginTop: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#C09832,#8B6914)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
                {loading ? 'Submitting…' : 'Register →'}
              </button>

              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                <p style={{ fontSize: 12.5, color: '#94a3b8' }}>
                  Already have an account? <Link href="/ct-login" style={{ color: '#8B6914', fontWeight: 600 }}>Sign in</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  paddingLeft: 38, width: '100%', padding: '9px 12px 9px 38px', border: '1px solid #334155',
  borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#1e293b', background: '#fff', outline: 'none',
}
