import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, DollarSign, Clock, HeartPulse } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import { getFeaturedListings, getTotalCount, getStateCounts } from '@/lib/data'
import { stateNameFromAbbr, formatSpecialty, SPECIALTIES } from '@/lib/utils'

export const revalidate = 3600

const HERO_SPECIALTIES = ['family_medicine', 'pediatrics', 'womens_health', 'obesity_medicine', 'geriatrics', 'mens_health']

export default async function HomePage() {
  const [featured, totalCount, stateCounts] = await Promise.all([
    getFeaturedListings(),
    getTotalCount(),
    getStateCounts(),
  ])

  const topStates = stateCounts.slice(0, 12)

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-teal font-display text-xs uppercase tracking-widest mb-4">
            {totalCount > 0 ? `${totalCount.toLocaleString()}+ DPC Practices Nationwide` : 'National DPC Directory'}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4">
            Your doctor should<br />
            <span className="text-brand-teal">know your name.</span>
          </h1>
          <p className="font-body text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Find a Direct Primary Care practice near you — flat monthly membership,
            no insurance required, no 7-minute appointments.
          </p>

          <Suspense>
            <SearchBar large />
          </Suspense>

          <p className="mt-4 text-gray-400 font-body text-sm">
            Typical DPC membership: $50–$150/month. No copays. No deductibles.
          </p>
        </div>
      </section>

      {/* How DPC works */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-brand-navy text-center text-xl font-bold mb-10 uppercase tracking-wide">
            How Direct Primary Care Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<DollarSign className="w-6 h-6 text-brand-teal" aria-label="flat fee" />}
              title="Flat Monthly Fee"
              body="Pay $50–$150/month directly to your doctor. No insurance billing, no copays, no deductibles."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6 text-brand-teal" aria-label="same-day access" />}
              title="Same-Day Access"
              body="DPC doctors see 300–600 patients instead of 2,000+. Same-day appointments are the norm."
            />
            <FeatureCard
              icon={<HeartPulse className="w-6 h-6 text-brand-teal" aria-label="comprehensive care" />}
              title="Comprehensive Care"
              body="Annual exams, labs, acute visits, chronic disease management, telehealth — all in the membership."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-brand-teal" aria-label="HSA eligible" />}
              title="HSA Eligible"
              body="Pair DPC with a high-deductible plan + HSA for the most cost-effective healthcare setup."
            />
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-brand-navy text-xl font-bold uppercase tracking-wide">
                Featured DPC Practices
              </h2>
              <Link
                href="/listings"
                className="flex items-center gap-1 text-brand-teal font-body text-sm hover:underline"
              >
                View all <ArrowRight className="w-4 h-4" aria-label="view all" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by specialty */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-brand-navy text-xl font-bold uppercase tracking-wide mb-8 text-center">
            Browse by Specialty
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HERO_SPECIALTIES.map(s => (
              <Link
                key={s}
                href={`/categories/${s.replace(/_/g, '-')}`}
                className="bg-surface border border-surface-border hover:border-brand-teal rounded-xl p-4 text-center transition-all hover:shadow-sm group"
              >
                <p className="font-display text-brand-navy text-xs font-bold group-hover:text-brand-teal transition-colors leading-tight">
                  {formatSpecialty(s)}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/listings" className="text-brand-teal font-body text-sm hover:underline">
              View all specialties →
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by state */}
      {topStates.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-brand-navy text-xl font-bold uppercase tracking-wide mb-8 text-center">
              Find DPC Practices by State
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {topStates.map(({ state, count }) => (
                <Link
                  key={state}
                  href={`/listings?state=${state}`}
                  className="bg-white border border-surface-border hover:border-brand-teal rounded-xl p-4 text-center transition-all hover:shadow-sm group"
                >
                  <p className="font-display text-brand-navy font-bold text-sm group-hover:text-brand-teal transition-colors">
                    {state}
                  </p>
                  <p className="font-body text-gray-400 text-xs mt-0.5">
                    {stateNameFromAbbr(state)}
                  </p>
                  <p className="font-body text-brand-teal text-xs font-semibold mt-1">{count} practices</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DPC vs Concierge explainer */}
      <section className="py-14 bg-brand-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-xl font-bold uppercase tracking-wide mb-8">
            DPC vs. Concierge Medicine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CompareCard
              title="Direct Primary Care"
              color="teal"
              items={[
                '$50–$150/month flat fee',
                'Drops insurance billing entirely',
                'No copays or deductibles',
                'Cost-optimized for patients',
                'Typical: solo or small practice',
              ]}
            />
            <CompareCard
              title="Concierge Medicine"
              color="gray"
              items={[
                '$150–$300+/month',
                'Still bills your insurance too',
                'You still pay copays/deductibles',
                'Adds convenience on top of insurance',
                'Typical: established physicians upgrading',
              ]}
            />
          </div>
          <p className="text-center text-gray-400 font-body text-sm mt-6">
            Many searches for &quot;concierge doctor near me&quot; are actually looking for DPC.
            DPC is the insurance-free, flat-fee model.
          </p>
        </div>
      </section>

      {/* CTA for physicians */}
      <section className="py-14 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-brand-navy text-xl font-bold uppercase tracking-wide mb-3">
            Are You a DPC Physician?
          </h2>
          <p className="font-body text-gray-600 mb-6">
            List your practice for free. Patients searching &ldquo;direct primary care near me&rdquo; are landing
            here right now. Upgrade to Verified ($99/yr) to show your photo, bio, pricing, and get
            priority placement.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Add Your Practice — Free
          </Link>
          <p className="text-gray-400 font-body text-xs mt-3">
            One new patient from your listing = 12× ROI on your first year of Verified.
          </p>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="bg-surface border border-surface-border rounded-xl p-5">
      <div className="w-10 h-10 bg-brand-mint rounded-lg flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-display text-brand-navy font-bold text-sm mb-2">{title}</h3>
      <p className="font-body text-gray-600 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

function CompareCard({ title, color, items }: { title: string; color: 'teal' | 'gray'; items: string[] }) {
  return (
    <div className={`rounded-xl p-5 ${color === 'teal' ? 'bg-brand-teal/10 border border-brand-teal/30' : 'bg-white/5 border border-white/10'}`}>
      <h3 className={`font-display font-bold text-sm uppercase tracking-wide mb-3 ${color === 'teal' ? 'text-brand-teal' : 'text-gray-400'}`}>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="font-body text-sm text-gray-200 flex items-start gap-2">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${color === 'teal' ? 'bg-brand-teal' : 'bg-gray-500'}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
