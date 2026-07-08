import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ListingCard from '@/components/ListingCard'
import { getListingsByCity } from '@/lib/data'

interface BestOfPage {
  slug: string
  city: string
  stateAbbr: string
  stateName: string
  headline: string
  intro: string
  whatToLook: string[]
}

const BEST_OF_PAGES: BestOfPage[] = [
  {
    slug: 'dpc-doctors-austin-tx',
    city: 'Austin',
    stateAbbr: 'TX',
    stateName: 'Texas',
    headline: 'Best Direct Primary Care Doctors in Austin, TX',
    intro: "Austin has one of the most active DPC physician communities in Texas. The city's large self-employed and entrepreneurial population — from tech founders to freelancers to small business owners — has driven strong demand for flat-fee primary care that doesn't involve insurance billing. DPC practices in Austin range from solo family medicine physicians serving small, intimate panels to group practices across multiple locations in the metro. Many Austin DPC doctors offer extended telehealth as part of the membership, reflecting the city's remote-work-heavy culture.",
    whatToLook: [
      'Panel availability — popular Austin DPC practices fill quickly; confirm they\'re accepting new patients',
      'Telehealth options — many Austin DPC physicians offer text/video access included in membership',
      'Membership pricing — Austin DPC practices typically charge $75–$140/month for adult memberships',
      'Services included — ask whether labs, basic procedures, and medication management are in the flat fee',
      'Physician background — board certifications and whether they have experience managing your specific health conditions',
    ],
  },
  {
    slug: 'dpc-doctors-houston-tx',
    city: 'Houston',
    stateAbbr: 'TX',
    stateName: 'Texas',
    headline: 'Best Direct Primary Care Doctors in Houston, TX',
    intro: "Houston's DPC market reflects the city's size and diversity. You'll find DPC practices serving the Houston metro across family medicine, internal medicine, and women's health specialties, with practices distributed across multiple suburbs and neighborhoods including The Woodlands, Sugar Land, Katy, and Pearland in addition to central Houston. Houston has a significant self-employed and small business owner population that finds the DPC model financially advantageous compared to individual marketplace plans. Several Houston DPC practices have particular depth in chronic disease management — relevant for the region's high rates of diabetes and cardiovascular conditions.",
    whatToLook: [
      'Location and commute — Houston is vast; prioritize practices within 20 minutes rather than just searching the whole city',
      'Chronic disease experience — if you manage diabetes, hypertension, or heart disease, ask about the practice\'s specific approach',
      'Family coverage — many Houston DPC practices offer family plans covering children and spouses at meaningful discounts',
      'HSA compatibility — confirm you can pay membership fees with HSA dollars (virtually all DPC practices allow this)',
      'Specialist network — ask which specialists the practice commonly refers to and how they coordinate ongoing care',
    ],
  },
  {
    slug: 'dpc-doctors-denver-co',
    city: 'Denver',
    stateAbbr: 'CO',
    stateName: 'Colorado',
    headline: 'Best Direct Primary Care Doctors in Denver, CO',
    intro: "Denver and the greater Front Range are home to one of the most concentrated DPC physician communities in the United States. Colorado has been a DPC-friendly regulatory environment since the state passed DPC-enabling legislation, and the Denver metro's health-conscious, active, and entrepreneurially-minded population aligns naturally with what DPC offers. Denver DPC practices often have a strong preventive care and wellness focus — annual exams, metabolic testing, health coaching conversations — in addition to standard acute and chronic care. Boulder and Fort Collins also have active DPC communities within the broader Front Range market.",
    whatToLook: [
      'Preventive care focus — Denver DPC practices often include proactive health screenings and metabolic testing in memberships',
      'Sports medicine and musculoskeletal care — relevant for the active Colorado outdoor lifestyle',
      'Pediatric vs. adult-only panels — confirm whether the practice sees children if you have a family',
      'Pricing for the Front Range — Denver DPC memberships typically run $65–$130/month for adults',
      'Coverage during travel — many Denver DPC physicians handle telehealth consultations if you\'re skiing, hiking, or traveling',
    ],
  },
  {
    slug: 'dpc-doctors-charlotte-nc',
    city: 'Charlotte',
    stateAbbr: 'NC',
    stateName: 'North Carolina',
    headline: 'Best Direct Primary Care Doctors in Charlotte, NC',
    intro: "Charlotte's rapid growth — driven by the financial services industry (Bank of America, Wells Fargo, Truist headquarters) and a large transplant population from across the Southeast — has created strong demand for DPC. The city's population of young professionals and dual-income families without strong geographic ties to existing PCPs makes DPC an attractive option. Charlotte's DPC market is growing quickly, with practices in Myers Park, Ballantyne, and the University area serving different quadrants of the metro.",
    whatToLook: [
      'Financial services and professional focus — many Charlotte DPC practices cater to the banking and insurance industry workforce',
      'Family vs. adult-only panels — Charlotte has a large family demographic; confirm whether your practice sees children',
      'Pricing range — Charlotte DPC memberships typically run $65–$120/month for adults, slightly lower than coastal markets',
      'Network approach for specialists — Charlotte DPC doctors can facilitate specialist referrals through Atrium Health, Novant Health, or Carolinas HealthCare',
      'Employer benefit integration — some Charlotte DPC practices work with area employers to offer DPC as a workforce health benefit',
    ],
  },
  {
    slug: 'dpc-doctors-miami-fl',
    city: 'Miami',
    stateAbbr: 'FL',
    stateName: 'Florida',
    headline: 'Best Direct Primary Care Doctors in Miami, FL',
    intro: "Miami's DPC market reflects the city's diverse, internationally-influenced population and its history of cash-pay and private-pay medical care. The city's large uninsured and underinsured population, combined with a health-conscious upper-income demographic in Brickell, Coral Gables, and Coconut Grove, has created two distinct DPC market segments. Many Miami DPC practices are Spanish-speaking or multilingual, reflecting the city's demographics. Florida has been a DPC-friendly regulatory state since early DPC legislation, and Miami's entrepreneurial culture has produced some of the most innovative DPC models in the Southeast.",
    whatToLook: [
      'Multilingual care — many Miami DPC practices offer Spanish and Portuguese; ask about language capabilities',
      'International patient experience — some Miami DPC doctors are experienced with patients splitting time between the US and Latin America or Europe',
      'Miami pricing — DPC memberships typically run $70–$150/month for adults, reflecting the city\'s higher cost of living',
      'Concierge vs. DPC models — Miami has both traditional DPC (affordable, large panels) and higher-end concierge-DPC hybrids; understand which model you\'re evaluating',
      'Telehealth for snowbirds — if you\'re in Miami seasonally, confirm your DPC practice handles telehealth for non-Florida months',
    ],
  },
  {
    slug: 'dpc-doctors-atlanta-ga',
    city: 'Atlanta',
    stateAbbr: 'GA',
    stateName: 'Georgia',
    headline: 'Best Direct Primary Care Doctors in Atlanta, GA',
    intro: "Atlanta has one of the Southeast's most active DPC physician communities. The city's large and growing professional population, tech sector (Microsoft, Google, Salesforce offices), and entrepreneurial culture align well with DPC's model of direct physician relationships and transparent pricing. Buckhead, Midtown, and the Perimeter have concentrations of DPC practices serving Atlanta's professional market, while Sandy Springs and Alpharetta serve the north metro. Georgia has been a DPC-friendly regulatory environment since the state passed DPC protection legislation.",
    whatToLook: [
      'Startup and tech employer integration — some Atlanta DPC practices work with employers in the Midtown tech corridor to offer DPC as a benefit',
      'Chronic disease management — Atlanta has high rates of hypertension, diabetes, and obesity; ask about the practice\'s approach to these conditions',
      'Atlanta pricing — DPC memberships typically run $65–$120/month for adults in the metro area',
      'LGBTQ+ affirming care — Atlanta has a large LGBTQ+ community; several Atlanta DPC practices specifically market inclusive primary care',
      'Telehealth coverage for frequent travelers — Atlanta is a major Delta hub; many Atlanta professionals travel frequently, so telehealth between visits matters',
    ],
  },
  {
    slug: 'dpc-doctors-san-diego-ca',
    city: 'San Diego',
    stateAbbr: 'CA',
    stateName: 'California',
    headline: 'Best Direct Primary Care Doctors in San Diego, CA',
    intro: "San Diego's DPC market is shaped by its large military and veteran population, significant biotech industry, and active outdoor lifestyle culture. Many San Diego DPC practices are experienced with military families transitioning off TRICARE and seeking civilian primary care, and with biotech employees whose employers may not offer strong primary care benefits. The La Jolla, Hillcrest, and North County coastal areas have established DPC practices, and the military corridor from National City to Oceanside has DPC options for veteran and active-duty families.",
    whatToLook: [
      'Military and TRICARE transition experience — San Diego has one of the largest active-duty and veteran populations; look for DPC doctors experienced in this transition',
      'Biotech and research employee fit — San Diego\'s biotech workers often have health-literate, prevention-oriented care needs that DPC serves well',
      'San Diego pricing — DPC memberships typically run $75–$150/month for adults, reflecting California\'s cost of living',
      'North County vs. South Bay availability — San Diego\'s geography means north-county and south-bay residents should confirm the practice is accessible, not just central San Diego',
      'Sports medicine and musculoskeletal care — relevant for San Diego\'s active outdoor and triathlon community',
    ],
  },
  {
    slug: 'dpc-doctors-phoenix-az',
    city: 'Phoenix',
    stateAbbr: 'AZ',
    stateName: 'Arizona',
    headline: 'Best Direct Primary Care Doctors in Phoenix, AZ',
    intro: "Phoenix and Scottsdale have a robust and growing DPC physician community. The Valley's large retiree population, snowbird seasonal residents, and growing young professional market create diverse DPC demand segments. Arizona's regulatory environment has been favorable to DPC, and Scottsdale's wellness culture has driven some practices to blend DPC with functional medicine and longevity optimization — a distinctive regional feature. Phoenix proper, Scottsdale, Mesa, and the northwest suburbs (Peoria, Surprise) all have DPC options.",
    whatToLook: [
      'Snowbird and part-time resident options — some Phoenix DPC practices offer seasonal membership tiers for patients who\'re in the Valley October–April',
      'Longevity and functional medicine blend — some Scottsdale DPC practices combine primary care with proactive health optimization; understand the price premium',
      'Phoenix pricing — DPC memberships typically run $65–$130/month for adults in the metro area',
      'Heat-related illness management — ask about the practice\'s experience with heat exhaustion, dehydration, and sun exposure-related conditions common in Phoenix',
      'Multi-state coordination — Phoenix\'s snowbird population often needs care coordination between Arizona and home-state providers; ask about the practice\'s approach',
    ],
  },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return BEST_OF_PAGES.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = BEST_OF_PAGES.find(p => p.slug === slug)
  if (!page) return {}

  return {
    title: `${page.headline} | DirectPrimaryCareFinder.com`,
    description: `Find top-rated Direct Primary Care doctors in ${page.city}, ${page.stateAbbr}. Flat monthly membership, no insurance, same-day access. Compare DPC practices in the ${page.city} area.`,
    alternates: { canonical: `https://www.directprimarycarefinder.com/best/${slug}` },
  }
}

export default async function BestOfPage({ params }: PageProps) {
  const { slug } = await params
  const page = BEST_OF_PAGES.find(p => p.slug === slug)
  if (!page) notFound()

  const listings = await getListingsByCity(page.city, page.stateAbbr, 12)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.headline,
    description: `Top Direct Primary Care practices in ${page.city}, ${page.stateAbbr}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 10).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.directprimarycarefinder.com/listings/${l.slug}`,
      name: l.practice_name ?? l.full_name,
    })),
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
          <span className="text-gray-700">{page.city}, {page.stateAbbr}</span>
        </nav>

        {/* Header */}
        <h1 className="font-display text-brand-navy text-3xl font-bold mb-4">
          {page.headline}
        </h1>
        <p className="font-body text-gray-600 max-w-3xl mb-8">
          {page.intro}
        </p>

        {/* What to look for */}
        <div className="bg-white border border-surface-border rounded-xl p-5 mb-8">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-3">
            What to Look For in a {page.city} DPC Practice
          </h2>
          <ul className="space-y-2">
            {page.whatToLook.map((item, i) => (
              <li key={i} className="flex items-start gap-2 font-body text-gray-700 text-sm">
                <span className="text-brand-teal mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-border p-12 text-center">
            <p className="font-display text-brand-navy font-bold text-lg mb-2">
              Building the {page.city} list
            </p>
            <p className="font-body text-gray-600 mb-4">
              We&apos;re actively seeding DPC practices in {page.city}. Are you a DPC physician here?
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
            <h2 className="font-display text-brand-navy font-bold text-lg mb-4">
              DPC Practices in {page.city}, {page.stateAbbr}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            <div className="text-center mb-8">
              <Link
                href={`/listings?state=${page.stateAbbr}&q=${encodeURIComponent(page.city)}`}
                className="inline-block border border-brand-teal text-brand-teal font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-teal hover:text-white transition-colors"
              >
                See All DPC Practices in {page.city}
              </Link>
            </div>
          </>
        )}

        {/* DPC Primer */}
        <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl p-5 mb-8">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-2">
            How to Choose a DPC Practice
          </h2>
          <p className="font-body text-gray-700 text-sm mb-3">
            Every DPC practice is different. Before committing to a membership, take advantage of free new-patient consultations most DPC physicians offer. Key questions to ask:
          </p>
          <ul className="space-y-1.5 font-body text-gray-700 text-sm">
            <li>• How many patients are in your current panel?</li>
            <li>• What's the typical response time when I message you directly?</li>
            <li>• What procedures can you perform in-office?</li>
            <li>• How do you handle specialist referrals?</li>
            <li>• What are your lab pricing arrangements?</li>
            <li>• Is the membership month-to-month or annual?</li>
          </ul>
        </div>

        {/* Related content */}
        <div className="mt-4">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-3">
            Learn More About DPC
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/guides/what-is-direct-primary-care"
              className="bg-white border border-surface-border rounded-lg p-4 hover:border-brand-teal transition-colors"
            >
              <p className="font-display text-brand-navy font-semibold text-sm">What Is Direct Primary Care?</p>
              <p className="font-body text-gray-500 text-xs mt-1">The complete patient guide to DPC membership</p>
            </Link>
            <Link
              href="/guides/dpc-vs-concierge-medicine"
              className="bg-white border border-surface-border rounded-lg p-4 hover:border-brand-teal transition-colors"
            >
              <p className="font-display text-brand-navy font-semibold text-sm">DPC vs. Concierge Medicine</p>
              <p className="font-body text-gray-500 text-xs mt-1">What's the real difference? Cost, access, and insurance explained</p>
            </Link>
            <Link
              href="/guides/direct-primary-care-hsa"
              className="bg-white border border-surface-border rounded-lg p-4 hover:border-brand-teal transition-colors"
            >
              <p className="font-display text-brand-navy font-semibold text-sm">DPC + HSA: Pay With Pre-Tax Dollars</p>
              <p className="font-body text-gray-500 text-xs mt-1">How to use your Health Savings Account for DPC membership</p>
            </Link>
            <Link
              href="/guides/is-dpc-right-for-me"
              className="bg-white border border-surface-border rounded-lg p-4 hover:border-brand-teal transition-colors"
            >
              <p className="font-display text-brand-navy font-semibold text-sm">Is DPC Right for You?</p>
              <p className="font-body text-gray-500 text-xs mt-1">5 questions to help you decide</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
