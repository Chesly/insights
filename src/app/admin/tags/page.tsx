import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/layout/Topbar'
import Link from 'next/link'

export default async function TagsPage() {
  const supabase = await createClient()
  const { data: tags } = await supabase
    .from('tags')
    .select('id, name, slug, post_count')
    .order('post_count', { ascending: false })

  return (
    <>
      <Topbar title="Tags"/>
      <div style={{ padding: 24, maxWidth: 800 }}>
        <div style={{ marginBottom: 16, fontSize: 13, color: '#64748b' }}>
          Tags are created automatically when you add them to posts. {(tags||[]).length} tags total.
        </div>
        <div className="cms-card">
          <table className="cms-table">
            <thead><tr><th>Tag</th><th>Slug</th><th>Posts</th><th>Actions</th></tr></thead>
            <tbody>
              {(tags||[]).length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No tags yet. Tags are auto-created when added to posts.
                </td></tr>
              )}
              {(tags||[]).map(tag => (
                <tr key={tag.id}>
                  <td>
                    <span style={{ background: 'rgba(139,105,20,0.1)', color: '#8B6914', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>#{tag.name}</span>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{tag.slug}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 700, color: '#8B6914' }}>{tag.post_count || 0}</span></td>
                  <td>
                    <Link href={`/admin/posts?tag=${tag.slug}`} style={{ fontSize: 12, color: '#8B6914', textDecoration: 'none', fontWeight: 600 }}>
                      View Posts →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
