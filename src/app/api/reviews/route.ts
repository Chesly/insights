import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

// GET — admin only, lists every review across every product. Uses the
// service-role client for the actual read: download_reviews only has a
// public "approved" RLS policy (see the migration), nothing granting an
// authenticated admin session broader access, so the session client
// would only ever see approved rows here — not what a moderation queue
// needs. The auth.getUser() check above is what actually gates this.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data, error } = await service
    .from('download_reviews')
    .select('*, download:downloads!download_id(name,slug)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
