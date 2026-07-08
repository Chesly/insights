"use client"
interface Props { checked: boolean; onChange: (v: boolean) => void; label?: string; size?: 'sm'|'md' }

export default function Toggle({ checked, onChange, label, size='md' }: Props) {
  const w = size==='sm' ? 32 : 36
  const h = size==='sm' ? 18 : 20
  const t = size==='sm' ? 12 : 14
  const tOn = size==='sm' ? 15 : 18

  return (
    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
      <button type="button" onClick={()=>onChange(!checked)}
        style={{ width:w, height:h, borderRadius:h, border:'none', cursor:'pointer', transition:'background 0.2s', position:'relative', background:checked?'#8B6914':'#cbd5e1', flexShrink:0 }}>
        <span style={{ width:t, height:t, borderRadius:'50%', background:'#fff', position:'absolute', top:(h-t)/2, left:checked?tOn:3, transition:'left 0.2s', display:'block' }}/>
      </button>
      {label && <span style={{ fontSize:13, fontWeight:500, color:'#374151' }}>{label}</span>}
    </label>
  )
}
