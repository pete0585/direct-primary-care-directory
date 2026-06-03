import { Suspense } from 'react'
import type { Metadata } from 'next'
import ListingCard from '@/components/ListingCard'
import FilterSidebar from '@/components/FilterSidebar'
import SearchBar from '@/components/SearchBar'
import { getListings } from '@/lib/data'
import { stateNameFromAbbr } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Find DPC Practices',
  description: 'Browse Direct Primary Care practices near you. Filter by state, specialty, pricing, and telehealth availability.',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    state?: string
    specialty?: string
    telehealth?: string
    accepting_new_patients?: string
    accepts_children?: string
    fee_max?: string
    page?: string
  }>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1', 10)

  const { listings, total } = await getListings({
    q: params.q,
    state: params.state,
    specialty: params.specialty,
    telehealth: params.telehealth === 'true',
    accepting_new_patients: params.accepting_new_patients === 'true',
    accepts_children: params.accepts_children === 'true',
    fee_max: params.fee_max ? parseInt(params.fee_max, 10) : undefined,
    page,
  })

  const pageSize = 24
  const totalPages = Math.ceil(total / pageSize)

  let heading = 'All DPC Practices'
  if (params.state) heading = `DPC Practices in ${stateNameFromAbbr(params.state)}`
  if (params.q) heading = `Results for "${params.q}"`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search bar */}
      <div className="mb-8">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="lg:w-56 shrink-0">
          <Suspense>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-display text-brand-navy font-bold text-lg">{heading}</h1>
            <span className="font-body text-gray-500 text-sm">
              {total.toLocaleString()} {total === 1 ? 'practice' : 'practices'}
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-xl border border-surface-border p-12 text-center">
              <p className="font-display text-brand-navy font-bold text-lg mb-2">No results found</p>
              <p className="font-body text-gray-600">
                Try adjusting your filters or searching a different area.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map(p => {
                const sp = new URLSearchParams(params as Record<string, string>)
                sp.set('page', String(p))
                return (
                  <a
                    key={p}
                    href={`/listings?${sp.toString()}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-body text-sm font-semibold transition-colors ${
                      p === page
                        ? 'bg-brand-teal text-white'
                        : 'bg-white border border-surface-border text-gray-600 hover:border-brand-teal'
                    }`}
                  >
                    {p}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
