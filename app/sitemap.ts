import { MetadataRoute } from 'next'
import { getAllSlugs, getStateCounts } from '@/lib/data'
import { SPECIALTIES } from '@/lib/utils'

const BASE = 'https://www.directprimarycarefinder.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, stateCounts] = await Promise.all([
    getAllSlugs(),
    getStateCounts(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/listings`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const listingPages: MetadataRoute.Sitemap = slugs.map(slug => ({
    url: `${BASE}/listings/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const statePages: MetadataRoute.Sitemap = stateCounts.map(({ state }) => ({
    url: `${BASE}/listings?state=${state}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = SPECIALTIES.map(s => ({
    url: `${BASE}/categories/${s.replace(/_/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...listingPages, ...statePages, ...categoryPages]
}
