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
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/register`,
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
        {
            url: `${baseUrl}/kebab-stockholm`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/kebab-goteborg`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/kebab-malmo`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/kebab-jonkoping`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/kebab-linkoping`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/kebab-lund`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/suggestions`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ]

    // Dynamic pages - kebab places
    let dynamicPages: MetadataRoute.Sitemap = []

    try {
        const places = await getKebabPlaces()
        dynamicPages = places.map((place: any) => {
            return {
                url: `${baseUrl}/${place.slug}`,
                lastModified: place.updatedAt ? new Date(place.updatedAt) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }
        })
    } catch (error) {
        console.error('Error generating sitemap for places:', error)
    }

    return [...staticPages, ...dynamicPages]
}
