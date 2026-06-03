import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/server'
import type { Listing, SearchFilters } from '@/lib/types'

const PAGE_SIZE = 24

const TIER_ORDER: Record<string, number> = { featured: 3, verified: 2, free: 1 }

function sortByTier(listings: Listing[]): Listing[] {
  return [...listings].sort((a, b) => {
    const diff = (TIER_ORDER[b.listing_tier] ?? 0) - (TIER_ORDER[a.listing_tier] ?? 0)
    if (diff !== 0) return diff
    return a.full_name.localeCompare(b.full_name)
  })
}

export async function getListings(
  filters: SearchFilters = {}
): Promise<{ listings: Listing[]; total: number }> {
  const supabase = await createClient()
  const { q, state, specialty, telehealth, accepting_new_patients, accepts_children, fee_max, tier, page = 1 } = filters
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('dpc_listings')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_approved', true)
    .range(offset, offset + PAGE_SIZE - 1)

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,practice_name.ilike.%${q}%,city.ilike.%${q}%`)
  }
  if (state) query = query.eq('state', state.toUpperCase())
  if (specialty) query = query.contains('specialties', [specialty])
  if (telehealth) query = query.eq('telehealth_available', true)
  if (accepting_new_patients) query = query.eq('accepting_new_patients', true)
  if (accepts_children) query = query.eq('accepts_children', true)
  if (fee_max) query = query.lte('monthly_fee_min', fee_max)
  if (tier) query = query.eq('listing_tier', tier)

  const { data, count, error } = await query
  if (error) throw error

  return { listings: sortByTier((data as Listing[]) ?? []), total: count ?? 0 }
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as Listing
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Listing
}

export async function getListingsByState(state: string): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .eq('state', state.toUpperCase())
    .eq('is_active', true)
    .eq('is_approved', true)
    .limit(60)

  if (error) return []
  return sortByTier((data as Listing[]) ?? [])
}

export async function getListingsBySpecialty(specialty: string): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .contains('specialties', [specialty])
    .eq('is_active', true)
    .eq('is_approved', true)
    .limit(60)

  if (error) return []
  return sortByTier((data as Listing[]) ?? [])
}

export async function getFeaturedListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .in('listing_tier', ['featured', 'verified'])
    .eq('is_active', true)
    .eq('is_approved', true)
    .limit(6)

  if (error) return []
  return sortByTier((data as Listing[]) ?? [])
}

export async function getRecentListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) return []
  return (data as Listing[]) ?? []
}

export async function getTotalCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('dpc_listings')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('is_approved', true)

  if (error) return 0
  return count ?? 0
}

// Uses static client — safe for generateStaticParams and sitemap
export async function getAllSlugs(): Promise<string[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('slug')
    .eq('is_active', true)
    .eq('is_approved', true)

  if (error) return []
  return data?.map((r: { slug: string }) => r.slug) ?? []
}

export async function getStateCounts(): Promise<{ state: string; count: number }[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('state')
    .eq('is_active', true)
    .eq('is_approved', true)

  if (error || !data) return []

  const counts: Record<string, number> = {}
  for (const row of data as { state: string }[]) {
    counts[row.state] = (counts[row.state] ?? 0) + 1
  }

  return Object.entries(counts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getListingsByCity(city: string, state: string, limit = 24): Promise<Listing[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .ilike('city', city)
    .eq('state', state.toUpperCase())
    .eq('is_active', true)
    .eq('is_approved', true)
    .limit(limit)

  if (error) return []
  return sortByTier((data as Listing[]) ?? [])
}

export async function getCityCount(city: string, state: string): Promise<number> {
  const supabase = createStaticClient()
  const { count, error } = await supabase
    .from('dpc_listings')
    .select('*', { count: 'exact', head: true })
    .ilike('city', city)
    .eq('state', state.toUpperCase())
    .eq('is_active', true)
    .eq('is_approved', true)

  if (error) return 0
  return count ?? 0
}

export async function getAdminListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('dpc_listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return []
  return (data as Listing[]) ?? []
}
