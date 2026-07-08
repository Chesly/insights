import Topbar from '@/components/layout/Topbar'

export default function CommentsPage() {
  return (
    <>
      <Topbar title="Comments"/>
      <div style={{ padding:24 }}>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'3rem', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:'1rem' }}>🚧</div>
          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:20, color:'#1e293b', marginBottom:'0.5rem' }}>Comments Module</h2>
          <p style={{ color:'#64748b', fontSize:14 }}>Ready to build in the next phase.</p>
        </div>
      </div>
    </>
  )
}
