'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { isTrackingEnabled } from '@/app/utils/analytics';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Check if analytics should be enabled
        const trackingEnabled = isTrackingEnabled();
        console.log('GoogleAnalytics: isTrackingEnabled:', trackingEnabled);
        console.log('GoogleAnalytics: GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID);
        console.log('GoogleAnalytics: NODE_ENV:', process.env.NODE_ENV);
        setShouldLoad(trackingEnabled);

        // Listen for consent changes
        const handleConsentChange = () => {
            const newTrackingEnabled = isTrackingEnabled();
            console.log('GoogleAnalytics: Consent changed, isTrackingEnabled:', newTrackingEnabled);
            setShouldLoad(newTrackingEnabled);
        };

        // Listen for storage changes (consent updates)
        window.addEventListener('storage', handleConsentChange);
        
        // Also listen for custom consent events
        window.addEventListener('consent-updated', handleConsentChange);

        return () => {
            window.removeEventListener('storage', handleConsentChange);
            window.removeEventListener('consent-updated', handleConsentChange);
        };
    }, []);

    // For development/testing, always show the component but conditionally load GA
    if (process.env.NODE_ENV === 'development') {
        return (
            <>
                {shouldLoad && (
                    <>
                        <Script
                            strategy="afterInteractive"
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                            onLoad={() => console.log('GoogleAnalytics: gtag script loaded')}
                        />
                        <Script
                            id="google-analytics"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    console.log('GoogleAnalytics: Initializing gtag with ID: ${GA_MEASUREMENT_ID}');
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${GA_MEASUREMENT_ID}', {
                                        anonymize_ip: true,
                                        allow_google_signals: false
                                    });
                                    console.log('GoogleAnalytics: gtag initialized');
                                `,
                            }}
                        />
                    </>
                )}
            </>
        );
    }

    if (!shouldLoad) {
        return null;
    }
    
    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                onLoad={() => console.log('GoogleAnalytics: gtag script loaded')}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        console.log('GoogleAnalytics: Initializing gtag with ID: ${GA_MEASUREMENT_ID}');
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            anonymize_ip: true,
                            allow_google_signals: false
                        });
                        console.log('GoogleAnalytics: gtag initialized');
                    `,
                }}
            />
        </>
    );
} 