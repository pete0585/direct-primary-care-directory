import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ListingCard from '@/components/ListingCard'
import { getListingsByState } from '@/lib/data'

interface StateInfo {
  abbr: string
  name: string
  slug: string
  summary: string
  cities: string[]
  landscape: string
}

const STATES: StateInfo[] = [
  {
    abbr: 'TX',
    name: 'Texas',
    slug: 'tx',
    summary: "Texas is one of the largest DPC markets in the country, with practices in all major metros and many smaller cities. The state's large self-employed population, business-friendly environment, and high proportion of residents on individual health plans make DPC a natural fit for Texans who want real access to their doctor.",
    cities: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth'],
    landscape: "Texas has no specific state DPC legislation, but the state's regulatory environment is generally permissive for physician-patient direct contracting. Texas DPC practices operate under the state's general medical practice acts. The Texas Medical Association recognizes DPC as a valid practice model. With 154+ DPC practices listed in our directory across the state, Texas has strong geographic coverage.",
  },
  {
    abbr: 'FL',
    name: 'Florida',
    slug: 'fl',
    summary: "Florida has the highest number of DPC practices in our directory (170+ listings), driven by the state's large population, significant self-employed and gig economy workforce, and massive retirement community that seeks alternatives to Medicare advantage plan restrictions.",
    cities: ['Tampa', 'Jacksonville', 'Orlando', 'Miami', 'Fort Lauderdale', 'Gainesville'],
    landscape: "Florida passed DPC-enabling legislation (HB 7 / CS/SB 1294) that explicitly excludes DPC arrangements from insurance regulation, giving Florida DPC practices a clear legal framework. Florida DPC practices frequently serve retirees, snowbirds, and Florida's massive tourism and hospitality industry workforce — large groups of people who either have limited employer insurance access or need primary care year-round despite part-time residency.",
  },
  {
    abbr: 'CO',
    name: 'Colorado',
    slug: 'co',
    summary: "Colorado has one of the highest DPC physician concentrations per capita in the United States. The Front Range from Fort Collins through Denver, Boulder, and Colorado Springs is particularly dense with DPC practices. Colorado's health-focused culture and strong small business community have made it a model DPC state.",
    cities: ['Denver', 'Boulder', 'Fort Collins', 'Colorado Springs'],
    landscape: "Colorado passed DPC-specific enabling legislation that clearly defines DPC as outside insurance regulation. The Colorado Medical Society actively supports DPC physician members. Colorado DPC practices frequently emphasize preventive care, metabolic health, and sports medicine — reflecting the state's active outdoor culture. With 103+ listings in our Colorado directory, coverage is strong across the Front Range.",
  },
  {
    abbr: 'TN',
    name: 'Tennessee',
    slug: 'tn',
    summary: "Tennessee has emerged as one of the Southeast's strongest DPC markets. Nashville leads the state, but Chattanooga, Knoxville, and Memphis all have active DPC physician communities. Tennessee's business-friendly environment and lack of state income tax make it attractive for the self-employed professionals who are the core DPC demographic.",
    cities: ['Nashville', 'Chattanooga', 'Knoxville'],
    landscape: "Tennessee passed legislation in 2021 defining DPC arrangements outside the insurance regulatory framework. The Tennessee Medical Association has endorsed DPC as a valid practice model. With 94+ DPC practices across the state in our directory, Tennessee has excellent geographic coverage for a state of its size.",
  },
  {
    abbr: 'WA',
    name: 'Washington',
    slug: 'wa',
    summary: "Washington state has a strong DPC physician community anchored by Seattle but extending to Spokane, Tacoma, and the broader metro. Washington's large tech workforce — contractors, founders, and remote workers who often lack employer insurance — is a natural DPC demographic.",
    cities: ['Seattle', 'Spokane', 'Tacoma'],
    landscape: "Washington passed DPC-enabling legislation that exempts DPC arrangements from the insurance code. The Washington State Medical Association supports DPC physicians. Seattle-area DPC practices frequently serve Amazon and Microsoft contractors, startup founders, and other tech professionals with variable income who prefer the predictability of DPC membership over complex insurance situations.",
  },
]

interface PageProps {
  params: Promise<{ state: string }>
}

export function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug } = await params
  const info = STATES.find(s => s.slug === stateSlug)
  if (!info) return {}

  return {
    title: `Direct Primary Care in ${info.name} | Find DPC Doctors Statewide`,
    description: `Find Direct Primary Care practices across ${info.name}. Browse ${info.name} DPC doctors by city — flat monthly membership, no insurance required, same-day access.`,
    alternates: { canonical: `https://www.directprimarycarefinder.com/states/${stateSlug}` },
  }
}

export default async function StatePage({ params }: PageProps) {
  const { state: stateSlug } = await params
  const info = STATES.find(s => s.slug === stateSlug)
  if (!info) notFound()

  const listings = await getListingsByState(info.abbr)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many Direct Primary Care practices are in ${info.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our directory lists ${listings.length}+ Direct Primary Care practices in ${info.name}, with coverage in ${info.cities.join(', ')} and surrounding areas. The number continues to grow as more physicians in ${info.name} transition to the DPC model.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is Direct Primary Care legal in ${info.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ${info.landscape}`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs font-body text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <Link href="/listings" className="hover:text-brand-teal transition-colors">Find DPC Practices</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <span className="text-gray-700">{info.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-brand-navy text-3xl font-bold mb-3">
            Direct Primary Care Directory — {info.name}
          </h1>
          <p className="font-body text-gray-600 max-w-2xl">
            {info.summary}
          </p>
        </div>

        {/* Cities */}
        <div className="mb-8">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-3">
            Browse by City in {info.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {info.cities.map(city => (
              <Link
                key={city}
                href={`/listings?state=${info.abbr}&q=${encodeURIComponent(city)}`}
                className="bg-white border border-surface-border hover:border-brand-teal text-gray-700 font-body text-sm px-4 py-2 rounded-full transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* DPC landscape */}
        <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl p-5 mb-8">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-2">
            DPC in {info.name}: What Patients Should Know
          </h2>
          <p className="font-body text-gray-700 text-sm">{info.landscape}</p>
        </div>

        {/* Listings */}
        <h2 className="font-display text-brand-navy font-bold text-lg mb-4">
          DPC Practices in {info.name} ({listings.length} listed)
        </h2>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-border p-12 text-center">
            <p className="font-display text-brand-navy font-bold text-lg mb-2">
              No listings yet for {info.name}
            </p>
            <p className="font-body text-gray-600 mb-4">
              Are you a DPC physician in {info.name}? Get your practice listed.
            </p>
            <Link
              href="/submit"
              className="inline-block bg-brand-teal text-white font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-teal-dark transition-colors"
            >
              Add Your Practice
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {listings.slice(0, 12).map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {listings.length > 12 && (
              <div className="text-center mb-8">
                <Link
                  href={`/listings?state=${info.abbr}`}
                  className="inline-block border border-brand-teal text-brand-teal font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-teal hover:text-white transition-colors"
                >
                  View All {listings.length} DPC Practices in {info.name}
                </Link>
              </div>
            )}
          </>
        )}

        {/* FAQ */}
        <div className="mt-10 border-t border-surface-border pt-8">
          <h2 className="font-display text-brand-navy font-bold text-lg mb-5">
            {info.name} DPC — Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: `How much does DPC cost in ${info.name}?`,
                a: `DPC membership costs in ${info.name} typically range from $50 to $150/month for adult patients. Family plans covering two adults and children usually run $150–$300/month. Exact pricing varies by practice, physician, and services included. Some ${info.name} practices offer age-based pricing (lower rates for younger patients). Contact practices in our directory directly for current pricing.`,
              },
              {
                q: `Does DPC replace health insurance in ${info.name}?`,
                a: `DPC replaces insurance for primary care, but most patients keep a separate plan for hospitalizations, specialist visits, and emergencies. Common pairings: DPC + a high-deductible health plan (qualifies you for HSA), or DPC + a health sharing plan like Sedera or Zion HealthShare. Total monthly cost is often significantly less than traditional comprehensive insurance.`,
              },
              {
                q: `How do I find a DPC doctor accepting new patients in ${info.name}?`,
                a: `Browse the listings above and look for practices marked "accepting new patients." You can also filter by city, specialty, and telehealth availability. Contact practices directly — most ${info.name} DPC physicians respond to new patient inquiries within 24 hours and offer a free meet-and-greet consultation before you commit to a membership.`,
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-lg border border-surface-border p-5">
                <h3 className="font-display text-brand-navy font-semibold text-sm mb-2">{q}</h3>
                <p className="font-body text-gray-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-brand-teal rounded-xl p-6 text-white text-center">
          <h2 className="font-display font-bold text-lg mb-2">
            DPC Physician in {info.name}? Get Listed Free.
          </h2>
          <p className="font-body text-sm opacity-90 mb-4">
            Claim your free listing or submit your practice. Verified listings get priority placement, a full profile, and direct patient inquiries.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-white text-brand-teal font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            List Your Practice
          </Link>
        </div>

        {/* Other states */}
        <div className="mt-8">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-3">
            Browse Other States
          </h2>
          <div className="flex flex-wrap gap-2">
            {STATES.filter(s => s.abbr !== info.abbr).map(s => (
              <Link
                key={s.abbr}
                href={`/states/${s.slug}`}
                className="bg-surface border border-surface-border hover:border-brand-teal text-gray-700 font-body text-sm px-3 py-1.5 rounded-full transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
