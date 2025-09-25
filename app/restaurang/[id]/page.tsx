import { Metadata } from 'next';
import PlacePageClient from '@/app/restaurang/[id]/PlacePageClient';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { createPlaceTitle, createPlaceDescription } from '@/app/lib/slugUtils';

// Generate metadata for the place page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const places = await getKebabPlaces();
        
        // First try to find by slug (if it's not a UUID)
        let place = null;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
        
        if (isUUID) {
            // If it's a UUID, find by ID
            place = places.find((p: any) => p.id === params.id);
        } else {
            // If it's a slug, find by admin-defined slug with restaurang/ prefix
            place = places.find((p: any) => 
                p.slug === `restaurang/${params.id}`
            );
        }
        
        console.log(place);
        if (!place) {
            return {
                title: 'Kebabställe hittades inte | Kebabkartan',
                description: 'Det efterfrågade kebabstället kunde inte hittas.',
            };
        }

        // Use admin-defined slug
        const slug = place.slug;
        const title = createPlaceTitle(place);
        const description = createPlaceDescription(place);

        return {
            title,
            description,
            alternates: {
                canonical: `https://www.kebabkartan.se/restaurang/${slug}`,
            },
            openGraph: {
                title,
                description,
                url: `https://www.kebabkartan.se/restaurang/${slug}`,
                type: 'website',
                images: [
                    {
                        url: '/static/logo.png',
                        width: 1200,
                        height: 630,
                        alt: `${place.name} - Kebabställe på ${place.address}`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: ['/static/logo.png'],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Kebabställe | Kebabkartan',
            description: 'Utforska och betygsätt kebabställen i Sverige.',
        };
    }
}

export default function PlacePage({ params }: { params: { id: string } }) {
    return <PlacePageClient id={params.id} />;
} 