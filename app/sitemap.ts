import { MetadataRoute } from 'next'
import { getKebabPlaces } from '@/lib/getKebabPlaces'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.kebabkartan.se'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/my-account`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic pages - kebab places
  let dynamicPages: MetadataRoute.Sitemap = []
  
  try {
    const places = await getKebabPlaces()
    dynamicPages = places.map((place: any) => ({
      url: `${baseUrl}/place/${place.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error generating sitemap for places:', error)
  }

  return [...staticPages, ...dynamicPages]
}
