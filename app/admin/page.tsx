import type { Metadata } from 'next'
import AdminTable from '@/components/AdminTable'
import { getAdminListings, getTotalCount } from '@/lib/data'
import { createServiceClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Admin — DPC Finder' }

export default async function AdminPage() {
  const supabase = await createServiceClient()

  const [listings, total] = await Promise.all([
    getAdminListings(),
    getTotalCount(),
  ])

  const { count: pendingCount } = await supabase
    .from('dpc_listings')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false)

  const { count: claimedCount } = await supabase
    .from('dpc_listings')
    .select('*', { count: 'exact', head: true })
    .not('claimed_at', 'is', null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-brand-navy text-xl font-bold mb-8">DPC Directory Admin</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Listings" value={total.toLocaleString()} />
        <StatCard label="Pending Approval" value={(pendingCount ?? 0).toString()} highlight />
        <StatCard label="Claimed" value={(claimedCount ?? 0).toString()} />
        <StatCard label="Last Updated" value={new Date().toLocaleDateString()} />
      </div>

      <div className="bg-white rounded-xl border border-surface-border">
        <div className="px-6 py-4 border-b border-surface-border">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide">
            Recent Listings
          </h2>
        </div>
        <AdminTable listings={listings} />
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border p-4 ${highlight ? 'border-amber-300' : 'border-surface-border'}`}>
      <p className="font-body text-gray-500 text-xs mb-1">{label}</p>
      <p className={`font-display font-bold text-xl ${highlight ? 'text-amber-500' : 'text-brand-navy'}`}>{value}</p>
    </div>
  )
}
