import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import Link from 'next/link'
import {
  FileText, FolderOpen, Image, Download, Mail,
  TrendingUp, Clock, CheckCircle, Calendar, ArrowRight, Plus
} from 'lucide-react'

interface DashboardPost {
  id: string
  title: string
  slug: string
  status: string
  featured: boolean
  trending: boolean
  popular: boolean
  created_at: string
  published_at?: string
  read_time: number
  view_count: number
  category?: { name: string; color: string } | null
}


async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [posts, cats, media, subs, downloads] = await Promise.all([
    supabase.from('posts').select('status'),
    supabase.from('categories').select('id'),
    supabase.from('media').select('id'),
    supabase.from('newsletter_subscribers').select('id').eq('status','active'),
    supabase.from('downloads').select('id'),
  ])
  const p = posts.data || []
  return {
    total_posts: p.length,
    published: p.filter(x=>x.status==='published').length,
    drafts: p.filter(x=>x.status==='draft').length,
    scheduled: p.filter(x=>x.status==='scheduled').length,
    categories: (cats.data||[]).length,
    media: (media.data||[]).length,
    subscribers: (subs.data||[]).length,
    downloads: (downloads.data||[]).length,
  }
}

async function getRecentPosts(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('posts')
    .select('id,title,slug,status,created_at,category:categories!category_id(name,color)')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [stats, recentPosts] = await Promise.all([getStats(supabase), getRecentPosts(supabase)])

  const statCards = [
    { label:'Total Posts', value: stats.total_posts, icon: FileText, color:'#1B2A4A', href:'/admin/posts', sub:`${stats.published} published` },
    { label:'Drafts', value: stats.drafts, icon: Clock, color:'#6b7280', href:'/admin/posts?status=draft', sub:`${stats.scheduled} scheduled` },
    { label:'Categories', value: stats.categories, icon: FolderOpen, color:'#8B6914', href:'/admin/categories', sub:'Active topics' },
    { label:'Media Files', value: stats.media, icon: Image, color:'#7c3aed', href:'/admin/media', sub:'ImageKit library' },
    { label:'Downloads', value: stats.downloads, icon: Download, color:'#0891b2', href:'/admin/downloads', sub:'Available files' },
    { label:'Subscribers', value: stats.subscribers, icon: Mail, color:'#059669', href:'/admin/newsletter', sub:'Active subscribers' },
  ]

  const statusColor: Record<string, string> = {
    draft:'#94a3b8', published:'#10b981', scheduled:'#3b82f6', archived:'#f59e0b'
  }

  return (
    <>
      <Topbar title="Dashboard" action={{ label:'New Post', href:'/admin/posts/new' }}/>
      <div style={{ padding:'24px', maxWidth:1200 }}>

        {/* Welcome */}
        <div style={{ background:'linear-gradient(135deg,#1B2A4A,#0f1c36)', borderRadius:14, padding:'20px 24px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ color:'#94a3b8', fontSize:13, marginBottom:4 }}>Welcome back 👋</p>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:20, color:'#f1f5f9' }}>
              {user?.email?.split('@')[0] || 'Admin'}
            </h2>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Link href="/admin/posts/new" className="btn btn-primary btn-sm"><Plus size={14}/>New Post</Link>
            <Link href="/admin/media" className="btn btn-secondary btn-sm">Upload Media</Link>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:28 }}>
          {statCards.map(card => {
            const Icon = card.icon
            return (
              <Link key={card.label} href={card.href} style={{ textDecoration:'none' }}>
                <div className="stat-card stat-card-hover" style={{ transition:'all 0.15s' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:`${card.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={18} color={card.color}/>
                    </div>
                    <ArrowRight size={14} color="#94a3b8"/>
                  </div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:28, color:'#1e293b', lineHeight:1 }}>{card.value}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#374151', marginTop:4 }}>{card.label}</div>
                  <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{card.sub}</div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick status row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
          {[
            { label:'Published', value:stats.published, color:'#10b981' },
            { label:'Drafts', value:stats.drafts, color:'#94a3b8' },
            { label:'Scheduled', value:stats.scheduled, color:'#3b82f6' },
            { label:'Archived', value:stats.total_posts-stats.published-stats.drafts-stats.scheduled, color:'#f59e0b' },
          ].map(s=>(
            <div key={s.label} className="cms-card" style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
              <div style={{ fontSize:20, fontWeight:800, color:'#1e293b', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two-col: recent posts + quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20 }}>
          {/* Recent posts */}
          <div className="cms-card">
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:'#1e293b' }}>Recent Posts</h3>
              <Link href="/admin/posts" style={{ fontSize:12, color:'#8B6914', fontWeight:600, textDecoration:'none' }}>View all →</Link>
            </div>
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Title</th><th>Category</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign:'center', color:'#94a3b8', padding:'2rem' }}>No posts yet. <Link href="/admin/posts/new" style={{ color:'#8B6914' }}>Create your first post →</Link></td></tr>
                )}
                {recentPosts.map((post: any) => (
                  <tr key={post.id}>
                    <td>
                      <Link href={`/admin/posts/${post.id}`} style={{ fontWeight:600, color:'#1e293b', textDecoration:'none', fontSize:13 }}>
                        {post.title.length > 45 ? post.title.slice(0,45)+'…' : post.title}
                      </Link>
                    </td>
                    <td>
                      {post.category && (
                        <span style={{ fontSize:11.5, fontWeight:600, color:(Array.isArray(post.category)?post.category[0]?.color:post.category?.color)||'#8B6914', background:`${(Array.isArray(post.category)?post.category[0]?.color:post.category?.color)||'#8B6914'}18`, padding:'2px 8px', borderRadius:999 }}>
                          {Array.isArray(post.category)?post.category[0]?.name:post.category?.name}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize:11.5, fontWeight:600, color:statusColor[post.status]||'#94a3b8', background:`${statusColor[post.status]||'#94a3b8'}18`, padding:'2px 8px', borderRadius:999 }}>
                        {post.status}
                      </span>
                    </td>
                    <td style={{ color:'#94a3b8', fontSize:12 }}>
                      {new Date(post.created_at).toLocaleDateString('en-ZA',{day:'numeric',month:'short'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick actions */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="cms-card" style={{ padding:'16px' }}>
              <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:12 }}>Quick Actions</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { label:'Write New Post', href:'/admin/posts/new', icon:'✍️' },
                  { label:'Upload Media', href:'/admin/media', icon:'🖼️' },
                  { label:'Add Category', href:'/admin/categories', icon:'📁' },
                  { label:'Add Download', href:'/admin/downloads', icon:'📥' },
                  { label:'View Subscribers', href:'/admin/newsletter', icon:'📧' },
                  { label:'SEO Audit', href:'/admin/seo', icon:'🔍' },
                ].map(a=>(
                  <Link key={a.label} href={a.href}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8, background:'#f8fafc', textDecoration:'none', fontSize:13, fontWeight:500, color:'#374151', transition:'all 0.15s', border:'1px solid #f1f5f9' }}>
                    <span style={{ fontSize:15 }}>{a.icon}</span>{a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Module status */}
            <div className="cms-card" style={{ padding:'16px' }}>
              <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:12 }}>Module Status</h3>
              {[
                { label:'Dashboard', done:true },
                { label:'Posts', done:true },
                { label:'Categories', done:true },
                { label:'Downloads', done:true },
                { label:'Media Library', done:false },
                { label:'Newsletter', done:false },
                { label:'SEO Audit', done:false },
                { label:'Pages', done:false },
              ].map(m=>(
                <div key={m.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #f8fafc', fontSize:13 }}>
                  <span style={{ color:'#374151' }}>{m.label}</span>
                  <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999, background:m.done?'#d1fae5':'#f1f5f9', color:m.done?'#065f46':'#94a3b8' }}>
                    {m.done?'✓ Ready':'Coming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .stat-grid{grid-template-columns:repeat(2,1fr)!important}
          .two-col{grid-template-columns:1fr!important}
        }
        @media(max-width:600px){
          .stat-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  )
}
