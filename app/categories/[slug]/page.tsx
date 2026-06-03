import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ListingCard from '@/components/ListingCard'
import { getListingsBySpecialty } from '@/lib/data'
import { formatSpecialty, SPECIALTIES } from '@/lib/utils'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

function slugToSpecialty(slug: string): string {
  return slug.replace(/-/g, '_')
}

export async function generateStaticParams() {
  return SPECIALTIES.map(s => ({ slug: s.replace(/_/g, '-') }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const specialty = slugToSpecialty(slug)
  const label = formatSpecialty(specialty)
  return {
    title: `${label} DPC Practices`,
    description: `Find Direct Primary Care doctors specializing in ${label}. Flat monthly membership, no insurance required.`,
    alternates: { canonical: `https://www.directprimarycarefinder.com/categories/${slug}` },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const specialty = slugToSpecialty(slug)

  if (!SPECIALTIES.includes(specialty)) notFound()

  const listings = await getListingsBySpecialty(specialty)
  const label = formatSpecialty(specialty)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${label} Direct Primary Care Practices`,
    description: `Directory of DPC practices specializing in ${label}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 10).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.directprimarycarefinder.com/listings/${l.slug}`,
      name: l.full_name,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs font-body text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <Link href="/listings" className="hover:text-brand-teal transition-colors">Find DPC Practices</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <span className="text-gray-700">{label}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-brand-navy text-2xl font-bold mb-3">
            {label} Direct Primary Care
          </h1>
          <p className="font-body text-gray-600 max-w-2xl">
            Find DPC practices specializing in {label}. Flat monthly membership, unlimited primary care,
            no insurance required. {listings.length > 0 ? `${listings.length} practices found.` : ''}
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-border p-12 text-center">
            <p className="font-display text-brand-navy font-bold text-lg mb-2">No practices yet</p>
            <p className="font-body text-gray-600 mb-4">
              We&apos;re actively building our {label} DPC directory. Check back soon or submit your practice.
            </p>
            <Link
              href="/submit"
              className="inline-block bg-brand-teal text-white font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-teal-dark transition-colors"
            >
              Add Your Practice
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Browse other specialties */}
        <div className="mt-12">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-4">
            Browse Other Specialties
          </h2>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.filter(s => s !== specialty).map(s => (
              <Link
                key={s}
                href={`/categories/${s.replace(/_/g, '-')}`}
                className="bg-surface border border-surface-border hover:border-brand-teal text-gray-700 font-body text-sm px-3 py-1.5 rounded-full transition-colors"
              >
                {formatSpecialty(s)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
