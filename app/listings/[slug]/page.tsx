import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ListingDetail from '@/components/ListingDetail'
import { getListingBySlug, getAllSlugs } from '@/lib/data'
import { formatFeeRange, formatSpecialty, stateNameFromAbbr } from '@/lib/utils'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createServiceClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) return { title: 'Practice Not Found' }

  const title = `${listing.full_name} — DPC Practice in ${listing.city}, ${listing.state}`
  const description = `${listing.full_name}${listing.practice_name ? ` (${listing.practice_name})` : ''} is a Direct Primary Care practice in ${listing.city}, ${listing.state}. Membership: ${formatFeeRange(listing.monthly_fee_min, listing.monthly_fee_max)}. ${listing.accepting_new_patients ? 'Accepting new patients.' : ''}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    },
    alternates: {
      canonical: `https://www.directprimarycarefinder.com/listings/${slug}`,
    },
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const stateName = stateNameFromAbbr(listing.state)

  const supabase = await createServiceClient()
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { count: viewCount } = await supabase
    .from('listing_views')
    .select('*', { count: 'exact', head: true })
    .eq('directory_slug', 'direct-primary-care')
    .eq('listing_id', String(listing.id))
    .gte('viewed_at', monthStart)
  const monthlyViews = viewCount ?? 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness', 'MedicalClinic'],
    name: listing.practice_name ?? listing.full_name,
    description: listing.bio ?? `Direct Primary Care practice in ${listing.city}, ${listing.state}`,
    url: listing.website ?? `https://www.directprimarycarefinder.com/listings/${listing.slug}`,
    telephone: listing.phone ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address_line1 ?? undefined,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip ?? undefined,
      addressCountry: 'US',
    },
    ...(listing.latitude && listing.longitude
      ? { geo: { '@type': 'GeoCoordinates', latitude: listing.latitude, longitude: listing.longitude } }
      : {}),
    ...(listing.monthly_fee_min || listing.monthly_fee_max
      ? {
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: listing.monthly_fee_min,
            maxPrice: listing.monthly_fee_max,
            priceCurrency: 'USD',
            unitText: 'monthly membership',
          },
        }
      : {}),
    employee: {
      '@type': 'Physician',
      name: listing.full_name,
    },
    medicalSpecialty: listing.specialties.map(s => formatSpecialty(s)),
    availableService: listing.services_included.map(s => ({ '@type': 'MedicalProcedure', name: s })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does ${listing.full_name}'s DPC membership cost?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The monthly membership at ${listing.practice_name ?? listing.full_name} is ${formatFeeRange(listing.monthly_fee_min, listing.monthly_fee_max)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${listing.full_name} accepting new DPC patients?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: listing.accepting_new_patients
            ? `Yes, ${listing.full_name} is currently accepting new Direct Primary Care patients.`
            : `${listing.full_name} currently has a waitlist. Contact the practice directly for availability.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs font-body text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <Link href="/listings" className="hover:text-brand-teal transition-colors">Find DPC Practices</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <Link href={`/listings?state=${listing.state}`} className="hover:text-brand-teal transition-colors">
            {stateName}
          </Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <span className="text-gray-700">{listing.full_name}</span>
        </nav>

        <ListingDetail listing={listing} monthlyViews={monthlyViews} />
      </div>
    </>
  )
}
