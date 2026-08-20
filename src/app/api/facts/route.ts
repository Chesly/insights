import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSessionProfile, isAllowedElevatedAccess } from '@/lib/auth/session'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('facts')
    .select('id, headline, slug, category, status, updated_at, created_at')
    .order('updated_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Structural site content (the homepage "Did You Know?" pool), same
  // access tier as Pages/Settings, not per-author content.
  const session = await getSessionProfile()
  if (!session || !isAllowedElevatedAccess(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { data, error } = await supabase
    .from('facts')
    .insert({
      slug: body.slug,
      headline: body.headline,
      fact_text: body.fact_text,
      context: body.context,
      source_name: body.source_name || null,
      source_url: body.source_url || null,
      category: body.category || null,
      faq: body.faq || [],
      status: body.status || 'draft',
      // image_url/special_date only sent when actually set, so creating a
      // fact before that migration runs doesn't fail on a column that
      // doesn't exist yet — same fix as the downloads scheduled_at bug.
      ...(body.image_url ? { image_url: body.image_url } : {}),
      ...(body.special_date ? { special_date: body.special_date } : {}),
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/')
  revalidatePath('/facts')
  return NextResponse.json({ data }, { status: 201 })
}
