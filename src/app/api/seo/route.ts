import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'
import { siteConfig } from '@/lib/siteConfig'

const TECH_CHECK_TIMEOUT_MS = 4000
const TECH_CHECK_HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; CheslyTechSeoChecker/1.0)' }

async function fetchOk(url: string): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TECH_CHECK_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal, headers: TECH_CHECK_HEADERS })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchBody(url: string): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TECH_CHECK_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal, headers: TECH_CHECK_HEADERS })
    return res.ok ? await res.text() : null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('id,title,slug,status,section,seo_title,meta_description,og_image,featured_image,body,excerpt,canonical_url,published_at')
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

  // Live technical checks — actually fetch the deployed site rather than
  // assuming the templates still emit what they did when this was written.
  const samplePost = posts.find(p => p.status === 'published')
  const sampleUrl = samplePost
    ? `${siteConfig.url}/${samplePost.section === 'coffee' ? 'coffee' : 'insights'}/${samplePost.slug}`
    : null

  const [sitemapOk, robotsOk, sampleHtml] = await Promise.all([
    fetchOk(`${siteConfig.url}/sitemap.xml`),
    fetchOk(`${siteConfig.url}/robots.txt`),
    sampleUrl ? fetchBody(sampleUrl) : Promise.resolve(null),
  ])

  const technical = {
    sitemap: sitemapOk,
    robots: robotsOk,
    organizationSchema: sampleHtml ? sampleHtml.includes('"@type":"Organization"') : null,
    articleSchema: sampleHtml ? sampleHtml.includes('"@type":"Article"') : null,
    personSchema: sampleHtml ? sampleHtml.includes('"@type":"Person"') : null,
    openGraph: sampleHtml ? /property="og:/.test(sampleHtml) : null,
    twitterCards: sampleHtml ? /name="twitter:/.test(sampleHtml) : null,
    canonicalUrls: totalPosts - missingMeta > 0,
    sampleUrl,
  }

  return NextResponse.json({
    stats: { totalPosts, missingMeta, missingSeoTitle, missingImage, thinContent, avgScore },
    posts: postAudits.sort((a, b) => a.score - b.score),
    technical,
  })
}
