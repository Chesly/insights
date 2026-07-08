"use client"
import { useState, useRef } from 'react'
import { X } from 'lucide-react'

interface Props {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
}

export default function TagInput({ tags, onChange, placeholder='Add tag…', suggestions=[] }: Props) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const add = (tag: string) => {
    const clean = tag.trim().toLowerCase()
    if (clean && !tags.includes(clean)) onChange([...tags, clean])
    setInput(''); setShowSuggestions(false)
  }

  const remove = (t: string) => onChange(tags.filter(x=>x!==t))

  const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)).slice(0,6)

  return (
    <div style={{ position:'relative' }}>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'6px 8px', border:'1px solid #e2e8f0', borderRadius:8, background:'#fff', minHeight:38, cursor:'text' }}
        onClick={()=>ref.current?.focus()}>
        {tags.map(t=>(
          <span key={t} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(139,105,20,0.12)', color:'#8B6914', borderRadius:6, padding:'3px 8px', fontSize:12.5, fontWeight:600 }}>
            {t}
            <button type="button" onClick={()=>remove(t)} style={{ background:'none', border:'none', cursor:'pointer', color:'#8B6914', display:'flex', padding:0 }}>
              <X size={11}/>
            </button>
          </span>
        ))}
        <input ref={ref} value={input} onChange={e=>{ setInput(e.target.value); setShowSuggestions(true) }}
          onKeyDown={e=>{ if(e.key==='Enter'||e.key===','){ e.preventDefault(); add(input) } if(e.key==='Backspace'&&!input){ remove(tags[tags.length-1]) } }}
          onBlur={()=>setTimeout(()=>setShowSuggestions(false),150)}
          placeholder={tags.length===0?placeholder:''}
          style={{ border:'none', outline:'none', fontSize:13, color:'#374151', minWidth:80, flex:1, background:'transparent' }}/>
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', zIndex:50, marginTop:4 }}>
          {filtered.map(s=>(
            <button key={s} type="button" onMouseDown={()=>add(s)}
              style={{ display:'block', width:'100%', padding:'8px 12px', fontSize:13, color:'#374151', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
