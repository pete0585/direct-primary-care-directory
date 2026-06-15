import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ClaimVerify({ listingId, monthlyViews }: { listingId: string; monthlyViews: number }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-surface-border shadow-sm p-8 text-center mb-6">
        <CheckCircle className="w-14 h-14 text-brand-teal mx-auto mb-4" aria-label="verified" />
        <h1 className="font-display text-brand-navy text-2xl font-bold mb-3">Listing Claimed!</h1>
        <p className="font-body text-gray-600">
          Your practice has been verified. Upgrade to start receiving inquiries from patients.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-surface-border shadow-sm p-6 mb-6">
        <div className='text-center mb-6'>
          <div className='text-5xl font-bold text-gray-900'>{monthlyViews}</div>
          <div className='text-gray-500 mt-1'>people viewed your profile this month</div>
          <div className='mt-3 text-red-600 font-semibold'>0 could contact you — your phone and website are hidden</div>
        </div>
        <div className='space-y-3 mb-2 text-left'>
          {([
            ['Your phone number visible to searchers', 'They can call you directly from your listing'],
            ['Your website linked', 'Drive traffic to your practice site'],
            ['Your full bio displayed', 'Build trust before they reach out'],
            ['Verified badge', 'Stand out from unclaimed profiles'],
          ] as [string, string][]).map(([title, sub]) => (
            <div key={title} className='flex items-start gap-3'>
              <span className='text-green-500 text-lg leading-tight'>✓</span>
              <div>
                <div className='font-medium text-gray-900'>{title}</div>
                <div className='text-sm text-gray-500'>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/listings/${listingId}`}
          className="bg-surface border border-surface-border text-brand-navy font-body font-semibold px-6 py-2.5 rounded-lg hover:border-brand-teal transition-colors text-center"
        >
          View My Listing
        </Link>
        <Link
          href="/api/upgrade"
          className="bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition-colors text-center"
        >
          Upgrade to Verified ($99/yr)
        </Link>
      </div>
    </div>
  )
}
