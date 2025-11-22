'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { trackKebabPlaceView } from '@/app/utils/analytics';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function PlacePageClient({ id }: { id: string }) {
    const router = useRouter();
    const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(id);

    const Map = dynamic(
        () => import('../../components/Map'),
        {
            loading: () => <p>Kebabkartan is loading</p>,
            ssr: false
        }
    );

    // Handle invalid place IDs and track place view
    useEffect(() => {
        const validatePlace = async () => {
            try {
                const response = await fetch('/api/kebab-places');
                const places = await response.json();
            
                const place = places.find((p: any) => p.slug === `restaurang/${currentPlaceId}`);

                if (!place) {
                    // Don't redirect immediately, let the Map component handle it
                    console.warn('Place not found:', currentPlaceId);
                } else {
                    // Track the place view
                    trackKebabPlaceView(place.id, place.name);
                    // Update document title for client-side navigation
                    document.title = `${place.name} | Betygsätt och recensera | Kebabkartan`;
                }
            } catch (error) {
                console.error('Error validating place:', error);
            }
        };

        validatePlace();
    }, [currentPlaceId, router]);

    // Handle navigation
    useEffect(() => {
        const handlePopState = () => {
            const pathParts = window.location.pathname.split('/');
            const urlPlaceId = pathParts[2];
            setCurrentPlaceId(urlPlaceId || null);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <main>
                <Map initialPlaceId={currentPlaceId} />
            </main>
        </GoogleReCaptchaProvider>
    );
} 