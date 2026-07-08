import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import Link from 'next/link'
import { Edit2, Trash2, Eye, Clock, CheckCircle, Archive, Calendar } from 'lucide-react'
import { formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'

interface SearchParams { status?: string; page?: string; q?: string }

export default async function PostsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const supabase = await createClient()
  const status = sp.status || ''
  const page = parseInt(sp.page || '1')
  const q = sp.q || ''
  const perPage = 15
  const from = (page-1)*perPage
  const to = from+perPage-1

  let query = supabase
    .from('posts')
    .select('id,title,slug,status,featured,trending,popular,created_at,published_at,read_time,view_count,category:categories(name,color),author:profiles(full_name)', { count:'exact' })
    .order('created_at', { ascending:false })
    .range(from, to)

  if (status) query = query.eq('status', status)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data: posts, count } = await query
  const totalPages = Math.ceil((count||0)/perPage)

  const tabs = [
    { label:'All', value:'', icon:null },
    { label:'Published', value:'published', icon:CheckCircle },
    { label:'Drafts', value:'draft', icon:Clock },
    { label:'Scheduled', value:'scheduled', icon:Calendar },
    { label:'Archived', value:'archived', icon:Archive },
  ]

  return (
    <>
      <Topbar title="Posts" action={{ label:'New Post', href:'/admin/posts/new' }}/>
      <div style={{ padding:24 }}>

        {/* Status tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'#f1f5f9', borderRadius:10, padding:4, width:'fit-content' }}>
          {tabs.map(tab=>(
            <Link key={tab.value} href={`/admin/posts${tab.value?`?status=${tab.value}`:''}`}
              style={{ padding:'7px 16px', borderRadius:7, fontSize:13, fontWeight:600, textDecoration:'none', transition:'all 0.15s',
                background:status===tab.value?'#fff':'transparent', color:status===tab.value?'#1e293b':'#64748b',
                boxShadow:status===tab.value?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Search bar */}
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          <form style={{ flex:1 }}>
            <input name="q" defaultValue={q} placeholder="Search posts by title…" className="cms-input" style={{ maxWidth:380 }}/>
            {status && <input type="hidden" name="status" value={status}/>}
          </form>
          <span style={{ fontSize:13, color:'#94a3b8', alignSelf:'center' }}>{count || 0} post{(count||0)!==1?'s':''}</span>
        </div>

        {/* Table */}
        <div className="cms-card">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Flags</th>
                <th>Date</th>
                <th>Views</th>
                <th style={{ width:100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!posts || posts.length===0) && (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
                  No posts found. <Link href="/admin/posts/new" style={{ color:'#8B6914', fontWeight:600 }}>Create your first post →</Link>
                </td></tr>
              )}
              {(posts||[]).map((post: any)=>{
                const cat = post.category as Record<string,string>|null
                const sc = STATUS_COLORS[post.status as string]||'bg-gray-100 text-gray-600'
                const [bg,...rest] = sc.split(' ')
                const bgColor = bg.replace('bg-','').includes('-') ? undefined : bg
                return (
                  <tr key={post.id as string}>
                    <td>
                      <div>
                        <Link href={`/admin/posts/${post.id}`} style={{ fontWeight:600, color:'#1e293b', textDecoration:'none', fontSize:13.5, lineHeight:1.4 }}>
                          {(post.title as string).length>60?(post.title as string).slice(0,60)+'…':post.title as string}
                        </Link>
                        <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>/{post.slug as string}</div>
                      </div>
                    </td>
                    <td>
                      {cat && <span style={{ fontSize:11.5, fontWeight:700, color:cat.color||'#8B6914', background:`${cat.color||'#8B6914'}1a`, padding:'3px 8px', borderRadius:999 }}>{cat.name}</span>}
                    </td>
                    <td>
                      <span style={{ fontSize:11.5, fontWeight:700, padding:'3px 10px', borderRadius:999,
                        background:{draft:'#f1f5f9',published:'#d1fae5',scheduled:'#dbeafe',archived:'#fef3c7'}[post.status as string]||'#f1f5f9',
                        color:{draft:'#64748b',published:'#065f46',scheduled:'#1e40af',archived:'#92400e'}[post.status as string]||'#64748b' }}>
                        {STATUS_LABELS[post.status as string]||post.status as string}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        {post.featured && <span style={{ fontSize:10, fontWeight:700, background:'#fef3c7', color:'#92400e', padding:'2px 6px', borderRadius:999 }}>⭐</span>}
                        {post.trending && <span style={{ fontSize:10, fontWeight:700, background:'#fce7f3', color:'#9d174d', padding:'2px 6px', borderRadius:999 }}>🔥</span>}
                        {post.popular && <span style={{ fontSize:10, fontWeight:700, background:'#dbeafe', color:'#1e40af', padding:'2px 6px', borderRadius:999 }}>📈</span>}
                      </div>
                    </td>
                    <td style={{ fontSize:12, color:'#94a3b8', whiteSpace:'nowrap' }}>
                      {post.published_at ? formatDate(post.published_at as string,'short') : formatDate(post.created_at as string,'short')}
                    </td>
                    <td style={{ fontSize:12, color:'#94a3b8' }}>{(post.view_count as number).toLocaleString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <Link href={`/admin/posts/${post.id}`} className="btn btn-ghost btn-sm" style={{ padding:'5px' }} title="Edit"><Edit2 size={13}/></Link>
                        <button className="btn btn-ghost btn-sm" style={{ padding:'5px', color:'#94a3b8' }} title="Preview"><Eye size={13}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:20 }}>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <Link key={p} href={`/admin/posts?${status?`status=${status}&`:''}page=${p}${q?`&q=${q}`:''}`}
                style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, fontWeight:600, textDecoration:'none',
                  background:p===page?'#8B6914':'#fff', color:p===page?'#fff':'#374151' }}>
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
