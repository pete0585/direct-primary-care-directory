'use client'

import { useState } from 'react'
import { Check, X, ExternalLink } from 'lucide-react'
import type { Listing } from '@/lib/types'

interface AdminTableProps {
  listings: Listing[]
}

export default function AdminTable({ listings: initial }: AdminTableProps) {
  const [listings, setListings] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function updateListing(id: string, patch: Partial<Listing>) {
    setLoading(id)
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      })
      if (res.ok) {
        setListings(ls => ls.map(l => (l.id === id ? { ...l, ...patch } : l)))
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-surface-border">
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Physician</th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Location</th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Tier</th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Status</th>
            <th className="text-left py-3 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(listing => (
            <tr key={listing.id} className="border-b border-surface-border hover:bg-surface/50">
              <td className="py-3 px-4">
                <p className="font-medium text-gray-900">{listing.full_name}</p>
                {listing.practice_name && (
                  <p className="text-xs text-gray-500">{listing.practice_name}</p>
                )}
              </td>
              <td className="py-3 px-4 text-gray-600">
                {listing.city}, {listing.state}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  listing.listing_tier === 'featured' ? 'bg-brand-teal text-white' :
                  listing.listing_tier === 'verified' ? 'bg-brand-navy text-white' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {listing.listing_tier}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {listing.is_approved ? (
                    <span className="text-emerald-600 text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" aria-label="approved" /> Approved
                    </span>
                  ) : (
                    <span className="text-amber-600 text-xs flex items-center gap-1">
                      <X className="w-3 h-3" aria-label="pending" /> Pending
                    </span>
                  )}
                  {listing.claimed_at && (
                    <span className="text-blue-600 text-xs">Claimed</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {!listing.is_approved && (
                    <button
                      onClick={() => updateListing(listing.id, { is_approved: true })}
                      disabled={loading === listing.id}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {listing.is_approved && (
                    <button
                      onClick={() => updateListing(listing.id, { is_approved: false })}
                      disabled={loading === listing.id}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                  <a
                    href={`/listings/${listing.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-brand-teal transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" aria-label="view listing" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {listings.length === 0 && (
        <p className="text-center py-8 text-gray-500 font-body">No listings found.</p>
      )}
    </div>
  )
}
