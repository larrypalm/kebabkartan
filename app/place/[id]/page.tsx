'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function PlacePage() {
    const params = useParams();
    const router = useRouter();
    const placeId = params.id as string;

    const Map = dynamic(
        () => import('../../components/Map'),
        {
            loading: () => <p>Kebabkartan is loading</p>,
            ssr: false
        }
    );

    // Handle invalid place IDs
    useEffect(() => {
        const validatePlace = async () => {
            try {
                const response = await fetch('/api/kebab-places');
                const places = await response.json();
                const placeExists = places.some((place: any) => place.id === placeId);
                
                if (!placeExists) {
                    router.push('/'); // Redirect to home if place doesn't exist
                }
            } catch (error) {
                console.error('Error validating place:', error);
            }
        };

        validatePlace();
    }, [placeId, router]);

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <main>
                <Map initialPlaceId={placeId} />
            </main>
        </GoogleReCaptchaProvider>
    );
} 