"use client"
import { useRef, useState } from 'react'
import { X } from 'lucide-react'

export interface PickerItem {
  id: string
  label: string
}

interface Props {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  options: PickerItem[]
  placeholder?: string
}

/** Same visual pattern as TagInput, but constrained to real items (by id)
    instead of freeform text — for linking a product/post to specific
    other products or posts rather than typing arbitrary tags. */
export default function RelatedItemPicker({ selectedIds, onChange, options, placeholder = 'Search…' }: Props) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const selectedItems = selectedIds
    .map(id => options.find(o => o.id === id))
    .filter((x): x is PickerItem => !!x)

  const add = (id: string) => {
    if (!selectedIds.includes(id)) onChange([...selectedIds, id])
    setInput(''); setShowSuggestions(false)
  }
  const remove = (id: string) => onChange(selectedIds.filter(x => x !== id))

  const filtered = options
    .filter(o => !selectedIds.includes(o.id) && o.label.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 8)

  return (
    <div style={{ position:'relative' }}>
      <div
        style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'6px 8px', border:'1px solid #e2e8f0', borderRadius:8, background:'#fff', minHeight:38, cursor:'text' }}
        onClick={() => ref.current?.focus()}
      >
        {selectedItems.map(item => (
          <span key={item.id} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(139,105,20,0.12)', color:'#8B6914', borderRadius:6, padding:'3px 8px', fontSize:12.5, fontWeight:600 }}>
            {item.label}
            <button type="button" onClick={() => remove(item.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#8B6914', display:'flex', padding:0 }}>
              <X size={11}/>
            </button>
          </span>
        ))}
        <input
          ref={ref}
          value={input}
          onChange={e => { setInput(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={selectedItems.length === 0 ? placeholder : ''}
          style={{ border:'none', outline:'none', fontSize:13, color:'#374151', minWidth:120, flex:1, background:'transparent' }}
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', zIndex:50, marginTop:4, maxHeight:220, overflowY:'auto' }}>
          {filtered.map(o => (
            <button key={o.id} type="button" onMouseDown={() => add(o.id)}
              style={{ display:'block', width:'100%', padding:'8px 12px', fontSize:13, color:'#374151', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
      {showSuggestions && input && filtered.length === 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', zIndex:50, marginTop:4, padding:'8px 12px', fontSize:12.5, color:'#94a3b8' }}>
          No matches
        </div>
      )}
    </div>
  )
}
