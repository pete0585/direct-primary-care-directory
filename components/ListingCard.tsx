import Link from 'next/link'
import Image from 'next/image'
import { MapPin, DollarSign, Check, Video, Users } from 'lucide-react'
import type { Listing } from '@/lib/types'
import { formatFeeRange, formatSpecialty, tierBadge } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const badge = tierBadge(listing.listing_tier)
  const isFeatured = listing.listing_tier === 'featured'

  return (
    <Link href={`/listings/${listing.slug}`} className="block group">
      <div
        className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 h-full flex flex-col
          ${isFeatured ? 'border-brand-teal shadow-sm ring-1 ring-brand-teal/20' : 'border-surface-border'}`}
      >
        {isFeatured && (
          <div className="bg-brand-teal text-white text-xs font-body font-semibold px-4 py-1.5 rounded-t-xl">
            Featured Practice
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-mint border border-brand-teal/20 flex items-center justify-center shrink-0 overflow-hidden">
              {listing.photo_url ? (
                <Image
                  src={listing.photo_url}
                  alt={listing.full_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover"
                />
              ) : (
                <span className="text-brand-navy font-display text-lg font-bold">
                  {listing.full_name.charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-brand-navy text-sm font-bold leading-tight group-hover:text-brand-teal transition-colors truncate">
                {listing.full_name}
              </h3>
              {listing.practice_name && (
                <p className="text-gray-500 text-xs font-body mt-0.5 truncate">{listing.practice_name}</p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" aria-label="location" />
                <span className="text-gray-500 text-xs font-body truncate">
                  {listing.city}, {listing.state}
                </span>
              </div>
            </div>
          </div>

          {listing.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {listing.specialties.slice(0, 3).map(s => (
                <span
                  key={s}
                  className="bg-brand-mint text-brand-navy text-xs font-body px-2 py-0.5 rounded-full"
                >
                  {formatSpecialty(s)}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs font-body text-gray-500 mt-auto pt-2 border-t border-surface-border">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-brand-teal" aria-label="monthly fee" />
              <span>{formatFeeRange(listing.monthly_fee_min, listing.monthly_fee_max)}</span>
            </div>
            {listing.telehealth_available && (
              <div className="flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-brand-teal" aria-label="telehealth" />
                <span>Telehealth</span>
              </div>
            )}
            {listing.accepts_children && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-teal" aria-label="pediatrics" />
                <span>Kids OK</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${badge.classes}`}>
              {badge.label}
            </span>
            {listing.accepting_new_patients ? (
              <span className="flex items-center gap-1 text-xs font-body text-emerald-600">
                <Check className="w-3.5 h-3.5" aria-label="accepting patients" />
                Accepting Patients
              </span>
            ) : (
              <span className="text-xs font-body text-gray-400">Waitlist only</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
