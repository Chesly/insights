import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import ProfileForm from '@/components/cms/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/ct-login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Topbar title="My Profile" />
      <div style={{ padding: 24, maxWidth: 560 }}>
        <ProfileForm profile={profile} email={user.email || ''} />
      </div>
    </>
  )
}
