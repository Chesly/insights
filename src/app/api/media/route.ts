import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const folder = searchParams.get('folder') || ''
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '50')
  const page = parseInt(searchParams.get('page') || '1')
  const from = (page - 1) * limit

  let query = supabase
    .from('media')
    .select('*, uploader:profiles(full_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (folder) query = (query as any).eq('folder', folder)
  if (search) query = (query as any).ilike('original_name', `%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data, count })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('media')
    .insert({ ...body, uploaded_by: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
