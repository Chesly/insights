"use client"
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/admin/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a 0%,#1B2A4A 50%,#0f172a 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ width:'100%', maxWidth:420, position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://ik.imagekit.io/mkvu8hdr5/insights/Chesly-Tech-Gol-Logo.png" alt="Chesly.Tech logo" alt="Chesly.Tech logo" style={{ height:44, margin:'0 auto 1.25rem', display:'block' }}/>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:19, color:'#f1f5f9', marginBottom:'0.35rem' }}>Content Management System</h1>
          <p style={{ color:'#64748b', fontSize:13 }}>Secure Administrator Access</p>
        </div>
        <div style={{ background:'#fff', borderRadius:16, padding:'2rem', boxShadow:'0 24px 48px rgba(0,0,0,0.3)' }}>
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1.125rem' }}>
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'#fee2e2', border:'1px solid #fecaca', borderRadius:8, padding:'0.75rem 1rem', color:'#dc2626', fontSize:13 }}>
                <AlertCircle size={15}/>{error}
              </div>
            )}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:'0.4rem' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="hello@chesly.tech" required className="cms-input" style={{ paddingLeft:38 }}/>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:'0.4rem' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required className="cms-input" style={{ paddingLeft:38, paddingRight:40 }}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding:4 }}>
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'10px', fontSize:14, marginTop:'0.25rem' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
          <div style={{ marginTop:'1.5rem', paddingTop:'1.25rem', borderTop:'1px solid #f1f5f9', textAlign:'center' }}>
            <p style={{ fontSize:12, color:'#94a3b8' }}>Chesly.Tech CMS · Admin Access Only</p>
          </div>
        </div>
      </div>
    </div>
  )
}
