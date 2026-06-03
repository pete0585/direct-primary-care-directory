import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServiceClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!adminUser) redirect('/')

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-brand-navy text-white px-6 py-3">
        <p className="font-display text-xs tracking-widest uppercase text-brand-teal">Admin Panel</p>
      </div>
      {children}
    </div>
  )
}
