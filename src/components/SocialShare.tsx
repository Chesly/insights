"use client"
import { useState } from 'react'

interface Props {
  title: string
  url: string
  excerpt?: string
}

export default function SocialShare({ title, url, excerpt }: Props) {
  const [copied, setCopied] = useState(false)

  const enc = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    text: encodeURIComponent(`${title}\n\n${url}`),
    summary: encodeURIComponent(excerpt || title),
  }

  const shareLinks = [
    { label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${enc.title}&url=${enc.url}&via=cheslytech`, emoji: '𝕏', color: '#000', hoverBg: '#000', hoverText: '#fff' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc.url}`, emoji: 'f', color: '#1877F2', hoverBg: '#1877F2', hoverText: '#fff' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/shareArticle?mini=true&url=${enc.url}&title=${enc.title}&summary=${enc.summary}`, emoji: 'in', color: '#0A66C2', hoverBg: '#0A66C2', hoverText: '#fff' },
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc.text}`, emoji: '💬', color: '#25D366', hoverBg: '#25D366', hoverText: '#fff' },
  ]

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg,#1B2A4A 0%,#0f1c36 100%)',
      borderRadius: 16, padding: '1.5rem 1.75rem',
      border: '1px solid rgba(139,105,20,0.25)',
      marginTop: '2.5rem', marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>
              Share this article
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, maxWidth: 340 }}>
            Help other South African entrepreneurs find this insight — every share counts.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {shareLinks.map(link => (
            <ShareBtn key={link.label} link={link}/>
          ))}
          <button
            onClick={copyLink}
            title="Copy link"
            style={{
              height: 42, padding: '0 16px', borderRadius: 10,
              background: copied ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.07)',
              border: `1px solid ${copied ? '#059669' : 'rgba(255,255,255,0.1)'}`,
              color: copied ? '#6ee7b7' : '#94a3b8',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
            {copied ? '✓' : '🔗'}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ShareBtn({ link }: { link: { label: string; href: string; emoji: string; color: string; hoverBg: string; hoverText: string } }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      title={`Share on ${link.label}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 42, height: 42, borderRadius: 10,
        background: hovered ? link.hoverBg : 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', transition: 'all 0.2s',
        fontSize: link.emoji.length <= 2 ? 13 : 16,
        fontWeight: 800, color: hovered ? link.hoverText : '#94a3b8',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 6px 16px ${link.hoverBg}44` : 'none',
      }}>
      {link.emoji}
    </a>
  )
}
