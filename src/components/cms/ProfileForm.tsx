"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, CheckCircle, AlertCircle, User } from 'lucide-react'
import ImagePicker from './ImagePicker'
import TagInput from './TagInput'

interface Profile {
  id: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  bio?: string | null
  avatar_url?: string | null
  job_title?: string | null
  company?: string | null
  location?: string | null
  website?: string | null
  public_email?: string | null
  public_slug?: string | null
  expertise?: string[] | null
  linkedin_url?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  youtube_url?: string | null
  github_url?: string | null
  show_author_page?: boolean
}

export default function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
  const [firstName, setFirstName] = useState(profile?.first_name || '')
  const [lastName, setLastName] = useState(profile?.last_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [pickerOpen, setPickerOpen] = useState(false)

  const [bio, setBio] = useState(profile?.bio || '')
  const [jobTitle, setJobTitle] = useState(profile?.job_title || '')
  const [company, setCompany] = useState(profile?.company || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [website, setWebsite] = useState(profile?.website || '')
  const [publicEmail, setPublicEmail] = useState(profile?.public_email || '')
  const [publicSlug, setPublicSlug] = useState(profile?.public_slug || '')
  const [expertise, setExpertise] = useState<string[]>(profile?.expertise || [])
  const [linkedin, setLinkedin] = useState(profile?.linkedin_url || '')
  const [facebook, setFacebook] = useState(profile?.facebook_url || '')
  const [instagram, setInstagram] = useState(profile?.instagram_url || '')
  const [youtube, setYoutube] = useState(profile?.youtube_url || '')
  const [github, setGithub] = useState(profile?.github_url || '')
  const [showAuthorPage, setShowAuthorPage] = useState(profile?.show_author_page ?? true)

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
        avatar_url: avatarUrl,
        bio,
        job_title: jobTitle,
        company,
        location,
        website,
        public_email: publicEmail,
        public_slug: publicSlug || null,
        expertise,
        linkedin_url: linkedin,
        facebook_url: facebook,
        instagram_url: instagram,
        youtube_url: youtube,
        github_url: github,
        show_author_page: showAuthorPage,
      })
      .eq('id', profile?.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Field = ({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
      {children}
      {help && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{help}</p>}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      {/* ── Basic info ── */}
      <div className="cms-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>Basic Info</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button onClick={() => setPickerOpen(true)} style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', border: '2px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={30} color="#94a3b8" />
            )}
          </button>
          <div>
            <button onClick={() => setPickerOpen(true)} className="btn btn-secondary btn-sm">Choose Photo</button>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Square image recommended</p>
          </div>
        </div>

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

        <Field label="Email (username)" help="Your login email and can't be changed here.">
          <input className="cms-input" value={email} disabled style={{ background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }} />
        </Field>

        <Field label="Contact Number">
          <input className="cms-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 12 345 6789" />
        </Field>
      </div>

      {/* ── Public author page ── */}
      <div className="cms-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b' }}>Public Author Page</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: showAuthorPage ? '#16a34a' : '#94a3b8', cursor: 'pointer' }}>
            <input type="checkbox" checked={showAuthorPage} onChange={e => setShowAuthorPage(e.target.checked)} />
            {showAuthorPage ? 'Visible' : 'Hidden'}
          </label>
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: -8, marginBottom: 16 }}>
          Turn this off anytime to remove your public byline page and personal details from the site — your posts stay published, just without a linked author profile. Useful if a conflict of interest comes up.
        </p>

        <Field label="Job Title / Role">
          <input className="cms-input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Founder & AI Creative Strategist" />
        </Field>

        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Company</label>
            <input className="cms-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Chesly.Tech" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Location</label>
            <input className="cms-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Johannesburg, South Africa" />
          </div>
        </div>

        <Field label="Biography" help="Shown on your public author page.">
          <textarea className="cms-input" rows={4} value={bio} onChange={e => setBio(e.target.value)}
            placeholder="Tell readers who you are and what you write about…" style={{ resize: 'vertical' }} />
        </Field>

        <Field label="Areas of Expertise">
          <TagInput tags={expertise} onChange={setExpertise} placeholder="Add a skill or topic…"
            suggestions={['Artificial Intelligence', 'SEO & GEO', 'Web Design', 'Digital Strategy', 'Branding', 'Business Growth']} />
        </Field>

        <Field label="Public URL slug" help={`Your author page will live at /author/${publicSlug || '...'}`}>
          <input className="cms-input" value={publicSlug} onChange={e => setPublicSlug(e.target.value)} placeholder="chesly-silaule" />
        </Field>

        <Field label="Public Contact Email" help="Shown on your author page. Can differ from your login email.">
          <input className="cms-input" value={publicEmail} onChange={e => setPublicEmail(e.target.value)} placeholder="hello@chesly.tech" />
        </Field>
      </div>

      {/* ── Social links ── */}
      <div className="cms-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>Social Links</h3>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: -10, marginBottom: 16 }}>Leave blank to hide — only links you fill in will show on your author page.</p>

        <Field label="Website"><input className="cms-input" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://chesly.tech" /></Field>
        <Field label="LinkedIn"><input className="cms-input" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…" /></Field>
        <Field label="Facebook"><input className="cms-input" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/…" /></Field>
        <Field label="Instagram"><input className="cms-input" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/…" /></Field>
        <Field label="YouTube"><input className="cms-input" value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="https://youtube.com/@…" /></Field>
        <Field label="GitHub"><input className="cms-input" value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/…" /></Field>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ minWidth: 160, justifyContent: 'center' }}>
        {saved ? <><CheckCircle size={14} />Saved!</> : saving ? 'Saving…' : <><Save size={14} />Save Profile</>}
      </button>

      <ImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => { setAvatarUrl(url); setPickerOpen(false) }}
        currentUrl={avatarUrl}
      />
    </div>
  )
}
