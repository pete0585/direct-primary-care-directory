import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ClaimForm from './ClaimForm'
import ClaimVerify from './ClaimVerify'
import { createServiceClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}

export const metadata: Metadata = {
  title: 'Claim Your DPC Practice Listing',
  description: 'Verify ownership of your DPC practice listing on DirectPrimaryCareFinder.com.',
}

export default async function ClaimPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { token } = await searchParams

  const supabase = await createServiceClient()

  // Verify token flow
  if (token) {
    const { data: claim, error } = await supabase
      .from('dpc_claims')
      .select('*')
      .eq('listing_id', id)
      .eq('token', token)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !claim) {
      return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-brand-navy text-xl font-bold mb-3">Invalid or Expired Link</h1>
          <p className="font-body text-gray-600 mb-6">
            This verification link has expired or is invalid. Please request a new one.
          </p>
          <a
            href={`/claim/${id}`}
            className="inline-block bg-brand-teal text-white font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-teal-dark transition-colors"
          >
            Request New Link
          </a>
        </div>
      )
    }

    // Mark as verified
    await supabase
      .from('dpc_claims')
      .update({ verified: true, verified_at: new Date().toISOString(), status: 'verified' })
      .eq('id', claim.id)

    await supabase
      .from('dpc_listings')
      .update({ claimed_at: new Date().toISOString(), claimed_by: claim.email, updated_at: new Date().toISOString() })
      .eq('id', id)

    return <ClaimVerify listingId={id} />
  }

  // Claim request form
  const { data: listing } = await supabase
    .from('dpc_listings')
    .select('id, full_name, practice_name, city, state, claimed_at')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  if (listing.claimed_at) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-brand-navy text-xl font-bold mb-3">Already Claimed</h1>
        <p className="font-body text-gray-600">
          This listing has already been claimed. If you believe this is an error, contact us at{' '}
          <a href="mailto:hello@directprimarycarefinder.com" className="text-brand-teal hover:underline">
            hello@directprimarycarefinder.com
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="font-display text-brand-navy text-2xl font-bold mb-2">Claim Your Listing</h1>
        <p className="font-body text-gray-600">
          Verify ownership of{' '}
          <strong>{listing.practice_name ?? listing.full_name}</strong> in {listing.city}, {listing.state}.
        </p>
      </div>
      <ClaimForm listingId={listing.id} listingName={listing.practice_name ?? listing.full_name} />
    </div>
  )
}
