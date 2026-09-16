import {articles as editorialArticles} from '@/lib/editorial-blog'
import { MetadataRoute } from 'next'
import { getAllSlugs, getStateCounts } from '@/lib/data'
import { BASE, getCityPageFolders } from '@/lib/site'
import { SPECIALTIES } from '@/lib/utils'

async function originalSitemap(): Promise<MetadataRoute.Sitemap> {
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

  const cityPages: MetadataRoute.Sitemap = getCityPageFolders().map((folder) => ({
    url: `${BASE}/dpc-doctors/${folder}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...listingPages, ...statePages, ...categoryPages, ...cityPages]
}

export default async function editorialSitemap():Promise<MetadataRoute.Sitemap>{const existing=await originalSitemap();const site="https://directprimarycarefinder.com";return [...existing,{url:site+'/blog',changeFrequency:'weekly'},...editorialArticles().map(p=>({url:site+'/blog/'+p.slug,lastModified:new Date(p.date),changeFrequency:'monthly' as const}))]}
