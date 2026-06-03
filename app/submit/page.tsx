import type { Metadata } from 'next'
import SubmitForm from '@/components/SubmitForm'

export const metadata: Metadata = {
  title: 'Add Your DPC Practice',
  description: 'List your Direct Primary Care practice on DirectPrimaryCareFinder.com. Free basic listing. Upgrade to Verified ($99/yr) for full profile and priority placement.',
}

export default function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-brand-navy text-2xl font-bold mb-3">Add Your DPC Practice</h1>
        <p className="font-body text-gray-600 max-w-lg mx-auto">
          Free listing includes your name, location, phone, and website. Upgrade to Verified ($99/yr)
          to add your bio, photo, services list, pricing, and get priority placement above free listings.
        </p>
      </div>

      {/* Pricing tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <TierCard
          name="Free"
          price="$0"
          features={['Name & location', 'Phone & website', 'Specialty tags', '"Claim this practice" CTA']}
          cta={false}
        />
        <TierCard
          name="Verified"
          price="$99/yr"
          highlight
          features={['Everything in Free', 'Photo & bio', 'Services included list', 'Pricing display', 'Priority placement', '"Verified DPC" badge', 'Contact form']}
          cta={false}
        />
        <TierCard
          name="Featured"
          price="$199/yr"
          features={['Everything in Verified', 'Top position in search', '"Featured Practice" badge', 'Dedicated SEO landing page', 'Monthly inquiry report']}
          cta={false}
        />
      </div>

      <SubmitForm />
    </div>
  )
}

function TierCard({
  name,
  price,
  features,
  highlight = false,
}: {
  name: string
  price: string
  features: string[]
  highlight?: boolean
  cta?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-5 border ${
        highlight
          ? 'border-brand-teal bg-brand-mint ring-1 ring-brand-teal/20'
          : 'border-surface-border bg-white'
      }`}
    >
      <p className={`font-display text-sm font-bold uppercase tracking-wide mb-1 ${highlight ? 'text-brand-teal' : 'text-brand-navy'}`}>
        {name}
      </p>
      <p className="font-display text-brand-navy text-2xl font-bold mb-4">{price}</p>
      <ul className="space-y-1.5">
        {features.map(f => (
          <li key={f} className="flex items-start gap-1.5 text-xs font-body text-gray-600">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${highlight ? 'bg-brand-teal' : 'bg-gray-400'}`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
