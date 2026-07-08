import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id,title,slug,status,seo_title,meta_description,og_image,featured_image,body,excerpt,canonical_url,published_at')
    .neq('status', 'archived')

  if (!posts) return NextResponse.json({ issues: [], score: 0, posts: [] })

  const issues = []
  const postAudits = posts.map(post => {
    const postIssues: string[] = []
    const warnings: string[] = []

    // SEO title checks
    if (!post.seo_title) postIssues.push('Missing SEO title')
    else if (post.seo_title.length < 30) warnings.push('SEO title too short (<30 chars)')
    else if (post.seo_title.length > 65) warnings.push('SEO title too long (>65 chars)')

    // Meta description checks
    if (!post.meta_description) postIssues.push('Missing meta description')
    else if (post.meta_description.length < 100) warnings.push('Meta description too short (<100 chars)')
    else if (post.meta_description.length > 165) warnings.push('Meta description too long (>165 chars)')

    // OG image
    if (!post.og_image && !post.featured_image) postIssues.push('Missing OG / featured image')

    // Body content
    const wordCount = (post.body || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
    if (wordCount < 300) postIssues.push(`Content too short (${wordCount} words, min 300)`)

    // Canonical
    if (!post.canonical_url) warnings.push('No canonical URL set')

    return {
      id: post.id, title: post.title, slug: post.slug, status: post.status,
      issues: postIssues, warnings, wordCount,
      score: Math.max(0, 100 - (postIssues.length * 20) - (warnings.length * 5)),
    }
  })

  // Global stats
  const totalPosts = posts.length
  const missingMeta = postAudits.filter(p => p.issues.includes('Missing meta description')).length
  const missingSeoTitle = postAudits.filter(p => p.issues.includes('Missing SEO title')).length
  const missingImage = postAudits.filter(p => p.issues.some(i => i.includes('image'))).length
  const thinContent = postAudits.filter(p => p.issues.some(i => i.includes('Content too short'))).length
  const avgScore = postAudits.length > 0 ? Math.round(postAudits.reduce((s, p) => s + p.score, 0) / postAudits.length) : 0

  return NextResponse.json({
    stats: { totalPosts, missingMeta, missingSeoTitle, missingImage, thinContent, avgScore },
    posts: postAudits.sort((a, b) => a.score - b.score),
  })
}
