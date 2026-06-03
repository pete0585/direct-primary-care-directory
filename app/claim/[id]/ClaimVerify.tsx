import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ClaimVerify({ listingId }: { listingId: string }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-14 h-14 text-brand-teal mx-auto mb-4" aria-label="verified" />
      <h1 className="font-display text-brand-navy text-2xl font-bold mb-3">Listing Claimed!</h1>
      <p className="font-body text-gray-600 mb-6">
        Your practice has been verified. Upgrade to Verified ($99/yr) to add your photo, bio,
        services, and get priority placement in search results.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/listings/${listingId}`}
          className="bg-surface border border-surface-border text-brand-navy font-body font-semibold px-6 py-2.5 rounded-lg hover:border-brand-teal transition-colors"
        >
          View My Listing
        </Link>
        <Link
          href="/api/upgrade"
          className="bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Upgrade to Verified ($99/yr)
        </Link>
      </div>
    </div>
  )
}
