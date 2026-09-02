import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

// GET /api/products?site=primehealthmeds&category=pain-relief
// `site` is required for the public storefront query path (there is no
// "all sites" product listing use case) but left optional here so the
// admin catalog view can still list every client's products at once.
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const site = req.nextUrl.searchParams.get('site')
  const categorySlug = req.nextUrl.searchParams.get('category')
  const publishedOnly = req.nextUrl.searchParams.get('published') === '1'

  let query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug,color,icon)')
    .order('created_at', { ascending: false })

  if (site) query = query.eq('site', site)
  if (publishedOnly) query = query.eq('is_published', true)
  if (categorySlug) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).eq('site', site || '').single()
    query = query.eq('category_id', cat?.id || '00000000-0000-0000-0000-000000000000')
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  if (!body.site) return NextResponse.json({ error: 'site is required' }, { status: 400 })
  const { data, error } = await supabase.from('products').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath(`/${data.site}`)
  return NextResponse.json({ data }, { status: 201 })
}
