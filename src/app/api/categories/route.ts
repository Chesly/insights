import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateSlug } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*, parent:categories(id,name)')
    .order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug || generateSlug(body.name)
  const { data, error } = await supabase
    .from('categories')
    .insert({ ...body, slug })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
