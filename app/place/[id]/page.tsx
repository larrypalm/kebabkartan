import { Metadata } from 'next';
import PlacePageClient from '@/app/place/[id]/PlacePageClient';
import { getKebabPlaces } from '@/lib/getKebabPlaces';

// Generate metadata for the place page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const places = await getKebabPlaces();
        const place = places.find((p: any) => p.id === params.id);
        console.log(place);
        if (!place) {
            return {
                title: 'Kebabställe hittades inte | Kebabkartan',
                description: 'Det efterfrågade kebabstället kunde inte hittas.',
            };
        }

        const title = `Kebabkartan - ${place.name} | Betygsätt och recensera | Kebabkartan`;
        const description = `Utforska ${place.name} på ${place.address}. Betygsätt och dela din erfarenhet av deras kebab. Läs recensioner och se betyg från andra besökare.`;
        console.log(title);

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url: `https://www.kebabkartan.se/place/${place.id}`,
                type: 'website',
                images: [
                    {
                        url: '/og-image.jpg',
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
                images: ['/og-image.jpg'],
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