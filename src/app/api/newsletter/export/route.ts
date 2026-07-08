import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const segment = searchParams.get('segment') || ''
  const status = searchParams.get('status') || 'active'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from('newsletter_subscribers').select('email,full_name,status,segment,source,subscribed_at').eq('status', status)
  if (segment) query = query.eq('segment', segment)

  const { data } = await query
  if (!data) return NextResponse.json({ error: 'No data' }, { status: 400 })

  const headers = ['email', 'full_name', 'status', 'segment', 'source', 'subscribed_at']
  const csv = [
    headers.join(','),
    ...data.map((row: Record<string, string>) => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="subscribers-${status}-${new Date().toISOString().split('T')[0]}.csv"`,
    }
  })
}
