import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin, Phone, Globe, DollarSign, Video, Users, Check, X,
  ShieldCheck, Award, Stethoscope
} from 'lucide-react'
import type { Listing } from '@/lib/types'
import { formatFeeRange, formatSpecialty, formatService, tierBadge } from '@/lib/utils'
import { ViewTracker } from './ViewTracker'

interface ListingDetailProps {
  listing: Listing
  monthlyViews: number
}

export default function ListingDetail({ listing, monthlyViews }: ListingDetailProps) {
  const badge = tierBadge(listing.listing_tier)
  const isClaimed = listing.listing_tier !== 'unclaimed' && listing.listing_tier != null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <ViewTracker listingId={String(listing.id)} directorySlug='direct-primary-care' />
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-surface-border p-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-brand-mint border border-brand-teal/20 flex items-center justify-center shrink-0 overflow-hidden">
              {listing.photo_url ? (
                <Image
                  src={listing.photo_url}
                  alt={listing.full_name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <span className="text-brand-navy font-display text-3xl font-bold">
                  {listing.full_name.charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full ${badge.classes}`}>
                  {badge.label}
                </span>
                {listing.accepting_new_patients && (
                  <span className="flex items-center gap-1 text-xs font-body text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Check className="w-3 h-3" aria-label="accepting patients" />
                    Accepting New Patients
                  </span>
                )}
              </div>
              <h1 className="font-display text-brand-navy text-xl font-bold">{listing.full_name}</h1>
              {listing.practice_name && (
                <p className="text-gray-600 font-body mt-0.5">{listing.practice_name}</p>
              )}
              <div className="flex items-center gap-1 mt-2 text-gray-500 font-body text-sm">
                <MapPin className="w-4 h-4 shrink-0" aria-label="location" />
                <span>{listing.city}, {listing.state}{listing.zip ? ` ${listing.zip}` : ''}</span>
              </div>
            </div>
          </div>

          {/* Pricing highlight */}
          <div className="mt-5 p-4 bg-brand-mint rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brand-teal" aria-label="monthly fee" />
              <div>
                <p className="font-display text-brand-navy font-bold text-lg">
                  {formatFeeRange(listing.monthly_fee_min, listing.monthly_fee_max)}
                </p>
                {listing.family_fee_min && (
                  <p className="text-gray-600 font-body text-sm">
                    Family plan: {formatFeeRange(listing.family_fee_min, listing.family_fee_max)}
                  </p>
                )}
                <p className="text-gray-500 font-body text-xs mt-0.5">
                  Monthly membership — no insurance required
                  {listing.hsa_eligible && ' · HSA eligible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {isClaimed && listing.bio && (
          <div className="bg-white rounded-xl border border-surface-border p-6">
            <h2 className="font-display text-brand-navy font-bold mb-3 text-sm uppercase tracking-wide">About This Practice</h2>
            <p className="font-body text-gray-700 leading-relaxed">{listing.bio}</p>
          </div>
        )}

        {/* Services */}
        {isClaimed && listing.services_included.length > 0 && (
          <div className="bg-white rounded-xl border border-surface-border p-6">
            <h2 className="font-display text-brand-navy font-bold mb-4 text-sm uppercase tracking-wide">
              What&apos;s Included in Your Membership
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {listing.services_included.map(s => (
                <div key={s} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-teal shrink-0" aria-label="included" />
                  <span className="font-body text-gray-700 text-sm">{formatService(s)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specialties */}
        {listing.specialties.length > 0 && (
          <div className="bg-white rounded-xl border border-surface-border p-6">
            <h2 className="font-display text-brand-navy font-bold mb-4 text-sm uppercase tracking-wide">Specialties & Focus Areas</h2>
            <div className="flex flex-wrap gap-2">
              {listing.specialties.map(s => (
                <span
                  key={s}
                  className="bg-brand-mint text-brand-navy font-body text-sm px-3 py-1 rounded-full border border-brand-teal/20"
                >
                  {formatSpecialty(s)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick facts */}
        <div className="bg-white rounded-xl border border-surface-border p-6">
          <h2 className="font-display text-brand-navy font-bold mb-4 text-sm uppercase tracking-wide">Practice Details</h2>
          <div className="grid grid-cols-2 gap-3">
            <Fact label="Telehealth" value={listing.telehealth_available} />
            <Fact label="Accepts Children" value={listing.accepts_children} />
            <Fact label="HSA Eligible" value={listing.hsa_eligible} />
            <Fact label="Accepts Insurance Patients" value={listing.accepts_insurance_patients} />
          </div>
          {(listing.min_age !== null || listing.max_age !== null) && (
            <p className="mt-3 text-gray-600 font-body text-sm">
              Age range: {listing.min_age ?? 0}
              {listing.max_age ? `–${listing.max_age}` : '+'} years
            </p>
          )}
          {listing.board_certifications.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.board_certifications.map(c => (
                <span key={c} className="flex items-center gap-1 text-xs font-body text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                  <Award className="w-3 h-3" aria-label="board certified" />
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* DPC explainer */}
        <div className="bg-brand-navy rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-brand-teal" aria-label="DPC info" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wide">What is Direct Primary Care?</h2>
          </div>
          <p className="font-body text-gray-300 text-sm leading-relaxed mb-3">
            Direct Primary Care (DPC) is a membership-based model where you pay your doctor a flat monthly fee —
            typically $50–150/month — and get unlimited access to primary care. No insurance billing. No copays. No
            surprise bills. Your doctor has time for you because they see 300–600 patients instead of the typical
            2,000+ in a traditional practice.
          </p>
          <p className="font-body text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Not the same as concierge medicine:</strong> Concierge practices charge
            $150–300+/month AND still bill your insurance. DPC drops insurance entirely and passes the savings to you.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        {isClaimed && (
          <div className='rounded-xl border border-blue-200 bg-blue-50 p-4'>
            <p className='text-xs font-semibold uppercase tracking-wide text-blue-600'>Profile Activity</p>
            <p className='mt-1 text-3xl font-bold text-blue-900'>{monthlyViews}</p>
            <p className='text-sm text-blue-700'>people viewed your profile this month</p>
            {listing.listing_tier === 'free' && (
              <p className='mt-2 text-xs text-blue-600'>
                0 could contact you.{' '}
                <a href={`/claim/${listing.id}?upgrade=true`} className='underline font-medium'>
                  Upgrade to be reachable →
                </a>
              </p>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="bg-white rounded-xl border border-surface-border p-5 sticky top-6">
          <h3 className="font-display text-brand-navy font-bold mb-4 text-sm uppercase tracking-wide">Contact</h3>

          {isClaimed ? (
            <>
              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors mb-2"
                >
                  <Phone className="w-4 h-4 text-brand-teal shrink-0" aria-label="phone" />
                  <span className="font-body text-gray-700 text-sm">{listing.phone}</span>
                </a>
              )}
              {listing.website && (
                <a
                  href={listing.website.startsWith('http') ? listing.website : `https://${listing.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors mb-2"
                >
                  <Globe className="w-4 h-4 text-brand-teal shrink-0" aria-label="website" />
                  <span className="font-body text-gray-700 text-sm truncate">Visit Website</span>
                </a>
              )}
              {listing.listing_tier !== 'free' && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-brand-teal" aria-label="verified" />
                    <p className="font-body text-gray-500 text-xs">Verified DPC practice</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-center'>
              <p className='text-sm text-gray-500'>
                Phone, website, and bio are only visible after this provider claims their listing.
              </p>
              <a href={`/claim/${listing.id}`} className='mt-2 inline-block text-sm font-medium text-blue-600 hover:underline'>
                Is this you? Claim your free profile →
              </a>
            </div>
          )}
        </div>

        {/* Upgrade prompt for claimed free listings */}
        {isClaimed && listing.listing_tier === 'free' && (
          <div className="bg-brand-mint rounded-xl border border-brand-teal/20 p-5">
            <h3 className="font-display text-brand-navy font-bold text-sm mb-2">Boost Your Visibility</h3>
            <p className="font-body text-gray-600 text-xs leading-relaxed mb-3">
              Upgrade to Verified ($99/yr) to add your photo, bio, services list, and appear above free listings.
            </p>
            <Link
              href={`/listings/${listing.slug}?upgrade=true`}
              className="block text-center bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              Upgrade to Verified →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {value ? (
        <Check className="w-4 h-4 text-brand-teal shrink-0" aria-label="yes" />
      ) : (
        <X className="w-4 h-4 text-gray-300 shrink-0" aria-label="no" />
      )}
      <span className={`font-body text-sm ${value ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}
