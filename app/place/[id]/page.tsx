'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { trackKebabPlaceView } from '@/app/utils/analytics';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function PlacePage() {
    const params = useParams();
    const router = useRouter();
    const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(params.id as string);

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
                const place = places.find((p: any) => p.id === currentPlaceId);
                
                if (!place) {
                    router.push('/'); // Redirect to home if place doesn't exist
                } else {
                    // Track the place view
                    trackKebabPlaceView(place.id, place.name);
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