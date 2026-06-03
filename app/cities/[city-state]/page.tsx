import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ListingCard from '@/components/ListingCard'
import { getListingsByCity, getCityCount } from '@/lib/data'

interface CityInfo {
  city: string
  state: string
  stateAbbr: string
  slug: string
  blurb: string
}

const CITIES: CityInfo[] = [
  {
    city: 'Austin', state: 'Texas', stateAbbr: 'TX', slug: 'austin-tx',
    blurb: "Austin's tech-forward, entrepreneurial culture made it one of the fastest-growing DPC markets in the country. Many Austin DPC practices offer same-day video or phone visits alongside in-person care — ideal for the city's self-employed population.",
  },
  {
    city: 'Houston', state: 'Texas', stateAbbr: 'TX', slug: 'houston-tx',
    blurb: "Houston's large self-employed and small business community has embraced Direct Primary Care as a smarter alternative to employer insurance. DPC practices here range from solo family medicine physicians to small group practices serving the entire metro.",
  },
  {
    city: 'Dallas', state: 'Texas', stateAbbr: 'TX', slug: 'dallas-tx',
    blurb: "Dallas has a strong and growing DPC physician community, with practices concentrated in and around the metro serving both urban professionals and suburban families looking for accessible, unhurried primary care.",
  },
  {
    city: 'Tampa', state: 'Florida', stateAbbr: 'FL', slug: 'tampa-fl',
    blurb: "Tampa Bay's DPC scene has grown quickly alongside the region's population boom. With a large concentration of self-employed residents, remote workers, and early retirees, DPC practices in Tampa find a ready market for flat-fee membership medicine.",
  },
  {
    city: 'Nashville', state: 'Tennessee', stateAbbr: 'TN', slug: 'nashville-tn',
    blurb: "Nashville is one of the strongest DPC markets in the Southeast. Tennessee's business-friendly environment and large small-employer base have created fertile ground for independent physicians who want to leave insurance billing behind.",
  },
  {
    city: 'Denver', state: 'Colorado', stateAbbr: 'CO', slug: 'denver-co',
    blurb: "Denver's health-conscious, outdoors-oriented population aligns naturally with DPC's prevention-focused model. Colorado has one of the highest DPC physician concentrations per capita in the US, and the Denver metro leads the state.",
  },
  {
    city: 'Seattle', state: 'Washington', stateAbbr: 'WA', slug: 'seattle-wa',
    blurb: "Seattle's large tech workforce — many of whom are self-employed contractors or startup founders — is a natural DPC demographic. Washington state has an active DPC physician community and strong legislative support for the model.",
  },
  {
    city: 'Kansas City', state: 'Missouri', stateAbbr: 'MO', slug: 'kansas-city-mo',
    blurb: "Kansas City is widely regarded as the birthplace of modern Direct Primary Care — Dr. Josh Umbehr's Atlas MD practice put the city on the DPC map and inspired a movement. The KC metro has a disproportionately large DPC physician community for its size.",
  },
  {
    city: 'Columbus', state: 'Ohio', stateAbbr: 'OH', slug: 'columbus-oh',
    blurb: "Columbus has a growing DPC physician community serving the city's rapidly expanding population. Ohio-based DPC practices often serve small business owners and self-employed professionals who find the flat-fee model a better fit than high-deductible plans.",
  },
  {
    city: 'Charlotte', state: 'North Carolina', stateAbbr: 'NC', slug: 'charlotte-nc',
    blurb: "Charlotte's thriving small business ecosystem has created strong demand for DPC. North Carolina DPC practices frequently offer telehealth as part of the membership — a key feature for the metro's many remote workers and commuters.",
  },
  {
    city: 'Atlanta', state: 'Georgia', stateAbbr: 'GA', slug: 'atlanta-ga',
    blurb: "Atlanta's diverse, fast-growing metro has seen DPC expand steadily. Many Atlanta DPC physicians serve both urban professionals and nearby suburban patients who want primary care without insurance delays or copays.",
  },
  {
    city: 'Miami', state: 'Florida', stateAbbr: 'FL', slug: 'miami-fl',
    blurb: "Miami's large self-employed and entrepreneur population — many in real estate, finance, and creative industries — has driven strong DPC adoption. Several Miami DPC practices serve Spanish-speaking patients and offer bilingual care.",
  },
  {
    city: 'Portland', state: 'Oregon', stateAbbr: 'OR', slug: 'portland-or',
    blurb: "Portland's independent-minded culture and strong progressive healthcare values have made it a natural home for DPC. Oregon physicians can practice DPC without insurance licensing complications, and the Portland metro has a healthy number of active practices.",
  },
  {
    city: 'Indianapolis', state: 'Indiana', stateAbbr: 'IN', slug: 'indianapolis-in',
    blurb: "Indianapolis has a growing DPC community anchored by entrepreneurial physicians who left hospital systems to start their own practices. Indiana's cost of living makes DPC membership pricing especially attractive compared to traditional insurance premiums.",
  },
  {
    city: 'Minneapolis', state: 'Minnesota', stateAbbr: 'MN', slug: 'minneapolis-mn',
    blurb: "Minneapolis has a cluster of DPC practices serving the Twin Cities metro. Minnesota DPC physicians tend to attract patients who have experienced frustration with the traditional primary care system and want a more responsive, relationship-based alternative.",
  },
  {
    city: 'Boston', state: 'Massachusetts', stateAbbr: 'MA', slug: 'boston-ma',
    blurb: "Boston's highly educated, high-earning professional population is receptive to DPC despite the region's strong traditional insurance market. DPC practices in the Boston area often attract tech workers, biotech professionals, and academics who value direct physician access.",
  },
  {
    city: 'San Diego', state: 'California', stateAbbr: 'CA', slug: 'san-diego-ca',
    blurb: "San Diego's large military veteran community and active-duty population, combined with a big entrepreneurial tech sector, makes it one of California's strongest DPC markets. Many SD practices emphasize preventive care and sports medicine alongside standard DPC services.",
  },
  {
    city: 'Scottsdale', state: 'Arizona', stateAbbr: 'AZ', slug: 'scottsdale-az',
    blurb: "Scottsdale's affluent, health-focused demographic and large population of retirees and snowbirds has created strong demand for premium primary care. Arizona DPC practices often offer obesity medicine, preventive care, and longevity-focused health management as part of their memberships.",
  },
  {
    city: 'Raleigh', state: 'North Carolina', stateAbbr: 'NC', slug: 'raleigh-nc',
    blurb: "Raleigh's Research Triangle tech hub has a large population of self-employed professionals and startup founders who prefer the predictability of DPC membership over high-deductible insurance plans. The area's DPC physician community is active and growing.",
  },
  {
    city: 'Salt Lake City', state: 'Utah', stateAbbr: 'UT', slug: 'salt-lake-city-ut',
    blurb: "Salt Lake City's large proportion of self-employed residents and entrepreneurial culture make it a strong DPC market. Utah DPC practices often serve young families and health-conscious patients who want comprehensive primary care without insurance gatekeeping.",
  },
]

interface PageProps {
  params: Promise<{ 'city-state': string }>
}

function getCityInfo(slug: string): CityInfo | null {
  return CITIES.find(c => c.slug === slug) ?? null
}

export async function generateStaticParams() {
  return CITIES.map(c => ({ 'city-state': c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'city-state': slug } = await params
  const info = getCityInfo(slug)
  if (!info) return {}

  return {
    title: `Direct Primary Care in ${info.city}, ${info.stateAbbr} | Find DPC Doctors Near You`,
    description: `Find Direct Primary Care practices in ${info.city}, ${info.state}. Flat monthly membership, unlimited primary care visits, no insurance required. ${info.city} DPC doctors accepting new patients.`,
    alternates: { canonical: `https://www.directprimarycarefinder.com/cities/${slug}` },
  }
}

export default async function CityPage({ params }: PageProps) {
  const { 'city-state': slug } = await params
  const info = getCityInfo(slug)
  if (!info) notFound()

  const [listings, count] = await Promise.all([
    getListingsByCity(info.city, info.stateAbbr, 24),
    getCityCount(info.city, info.stateAbbr),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many Direct Primary Care practices are in ${info.city}, ${info.stateAbbr}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our directory lists ${count} Direct Primary Care practices in and around ${info.city}, ${info.state}. The number of DPC practices in the area continues to grow as more physicians transition out of insurance-based billing.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is Direct Primary Care the same as concierge medicine in ${info.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `No. DPC and concierge medicine are different models. DPC practices in ${info.city} typically charge $50–$150/month and don't accept insurance for primary care. Concierge practices charge $150–$300+/month but usually keep insurance billing on top of the membership fee. DPC is generally the more affordable option for patients who want direct physician access.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I use my HSA for Direct Primary Care in ${info.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. DPC membership fees are HSA-eligible under provisions included in the SECURE Act 2.0 and the 2025 "Big Beautiful Bill." Patients in ${info.city} can use pre-tax HSA dollars to pay for DPC membership — often making the effective cost 20–35% lower depending on your tax bracket.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I find a DPC doctor near me in ${info.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use the listings above to browse DPC practices in ${info.city}, ${info.stateAbbr}. Filter by specialty, telehealth availability, or whether they see children. Contact the practice directly via phone or website — DPC physicians typically respond quickly since they manage small patient panels.`,
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
          <span className="text-gray-700">{info.city}, {info.stateAbbr}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-brand-navy text-3xl font-bold mb-3">
            Direct Primary Care in {info.city}, {info.state}
          </h1>
          <p className="font-body text-gray-600 max-w-2xl mb-2">
            {info.blurb}
          </p>
          {count > 0 && (
            <p className="font-body text-brand-teal font-semibold text-sm">
              {count} DPC {count === 1 ? 'practice' : 'practices'} listed in {info.city}
            </p>
          )}
        </div>

        {/* What is DPC callout */}
        <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl p-5 mb-8">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-2">
            What is Direct Primary Care?
          </h2>
          <p className="font-body text-gray-700 text-sm">
            Direct Primary Care (DPC) is a healthcare model where patients pay a flat monthly membership fee — typically $50–$150/month — directly to their doctor. There are no copays, no surprise bills, and no insurance involved for primary care. In return, you get unlimited visits, same-day or next-day appointments, direct access to your physician by text or phone, and wholesale-priced labs and medications. Most DPC patients pair membership with a low-cost catastrophic insurance plan for emergencies.
          </p>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-border p-12 text-center">
            <p className="font-display text-brand-navy font-bold text-lg mb-2">
              No listings yet for {info.city}
            </p>
            <p className="font-body text-gray-600 mb-4">
              We&apos;re actively building our {info.city} DPC directory. Are you a DPC physician here?
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {count > listings.length && (
              <div className="text-center mb-8">
                <Link
                  href={`/listings?state=${info.stateAbbr}&q=${encodeURIComponent(info.city)}`}
                  className="inline-block border border-brand-teal text-brand-teal font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-teal hover:text-white transition-colors"
                >
                  View All {count} DPC Practices in {info.city}
                </Link>
              </div>
            )}
          </>
        )}

        {/* FAQ */}
        <div className="mt-10 border-t border-surface-border pt-8">
          <h2 className="font-display text-brand-navy font-bold text-lg mb-5">
            Frequently Asked Questions — DPC in {info.city}
          </h2>
          <div className="space-y-5">
            {[
              {
                q: `How much does a DPC membership cost in ${info.city}?`,
                a: `Most DPC practices in ${info.city} charge between $50 and $150 per month for adult memberships. Family plans are typically $150–$300/month. The exact price varies by practice, the physician's patient panel size, and services included. Practices that include labs, imaging interpretation, or minor procedures in the membership may charge at the higher end.`,
              },
              {
                q: `Do I still need health insurance if I join a DPC practice in ${info.city}?`,
                a: `DPC handles primary care, but you'll still want coverage for hospitalizations, surgeries, specialist visits, and emergencies. Most DPC patients pair their membership with a high-deductible health plan (HDHP), catastrophic-only coverage, or a health sharing plan like Zion HealthShare or Sedera. This combination often costs significantly less than traditional insurance with copays.`,
              },
              {
                q: `Is Direct Primary Care the same as concierge medicine in ${info.city}?`,
                a: `No. DPC and concierge medicine are different. DPC practices in ${info.city} typically charge $50–$150/month and don't bill insurance at all. Concierge practices charge $150–$300+/month but continue billing insurance on top of the retainer fee. DPC is generally the more affordable, insurance-free option.`,
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
            Are You a DPC Physician in {info.city}?
          </h2>
          <p className="font-body text-sm opacity-90 mb-4">
            Get your practice listed on DirectPrimaryCareFinder.com — free to start. Verified listings get priority placement and a full profile with pricing, bio, and services.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-white text-brand-teal font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            List Your Practice Free
          </Link>
        </div>

        {/* Browse other cities */}
        <div className="mt-8">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-3">
            Browse DPC in Other Cities
          </h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.filter(c => c.slug !== slug).slice(0, 12).map(c => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="bg-surface border border-surface-border hover:border-brand-teal text-gray-700 font-body text-sm px-3 py-1.5 rounded-full transition-colors"
              >
                {c.city}, {c.stateAbbr}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
