'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { isTrackingEnabled } from '@/app/utils/analytics';
import { usePathname } from 'next/navigation';

// Helper to check if analytics debugging is enabled
const isDebugAnalyticsEnabled = () => {
  return process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true';
};

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [gtagInitialized, setGtagInitialized] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Validate GA_MEASUREMENT_ID
        if (!GA_MEASUREMENT_ID) {
            console.error('GoogleAnalytics: GA_MEASUREMENT_ID is not provided');
            return;
        }

        if (!GA_MEASUREMENT_ID.startsWith('G-')) {
            console.error('GoogleAnalytics: Invalid GA_MEASUREMENT_ID format:', GA_MEASUREMENT_ID);
            return;
        }

        // Disable on admin routes
        const isAdminRoute = pathname?.startsWith('/admin');
        if (isAdminRoute) {
            setShouldLoad(false);
            return;
        }

        // Check if analytics should be enabled (consent etc.)
        const trackingEnabled = isTrackingEnabled();
        if (isDebugAnalyticsEnabled()) {
            console.log('GoogleAnalytics: isTrackingEnabled:', trackingEnabled);
            console.log('GoogleAnalytics: GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID);
            console.log('GoogleAnalytics: NODE_ENV:', process.env.NODE_ENV);
        }
        setShouldLoad(trackingEnabled);

        // Listen for consent changes
        const handleConsentChange = () => {
            // Add a small delay to ensure cookie is set
            setTimeout(() => {
                const newTrackingEnabled = isTrackingEnabled();
                if (isDebugAnalyticsEnabled()) {
                    console.log('GoogleAnalytics: Consent changed, isTrackingEnabled:', newTrackingEnabled);
                }
                setShouldLoad(newTrackingEnabled);
            }, 100);
        };

        // Listen for storage changes (consent updates)
        window.addEventListener('storage', handleConsentChange);
        
        // Also listen for custom consent events
        window.addEventListener('consent-updated', handleConsentChange);

        // Fallback: Check periodically for consent changes (every 2 seconds for first 10 seconds)
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = setInterval(() => {
            if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
                return;
            }
            
            const currentTrackingEnabled = isTrackingEnabled();
            if (currentTrackingEnabled !== shouldLoad) {
                if (isDebugAnalyticsEnabled()) {
                    console.log('GoogleAnalytics: Fallback check detected consent change');
                }
                setShouldLoad(currentTrackingEnabled);
                clearInterval(checkInterval);
            }
            checkCount++;
        }, 2000);

        return () => {
            window.removeEventListener('storage', handleConsentChange);
            window.removeEventListener('consent-updated', handleConsentChange);
            clearInterval(checkInterval);
        };
    }, [shouldLoad, GA_MEASUREMENT_ID, pathname]);

    // Check if gtag is available and working
    useEffect(() => {
        if (shouldLoad && scriptLoaded) {
            const checkGtag = () => {
                if (typeof window !== 'undefined' && window.gtag) {
                    if (isDebugAnalyticsEnabled()) {
                        console.log('GoogleAnalytics: gtag function is available');
                    }
                    setGtagInitialized(true);

                    // Test gtag function
                    if (isDebugAnalyticsEnabled()) {
                        try {
                            window.gtag('event', 'test_event', {
                                event_category: 'debug',
                                event_label: 'gtag_availability_test'
                            });
                            console.log('GoogleAnalytics: gtag test event sent successfully');
                        } catch (error) {
                            console.error('GoogleAnalytics: Error testing gtag function:', error);
                        }
                    }
                } else {
                    if (isDebugAnalyticsEnabled()) {
                        console.warn('GoogleAnalytics: gtag function not available, retrying...');
                    }
                    setTimeout(checkGtag, 1000);
                }
            };
            
            // Check immediately and then retry if needed
            checkGtag();
        }
    }, [shouldLoad, scriptLoaded]);

    const handleScriptLoad = () => {
        if (isDebugAnalyticsEnabled()) {
            console.log('GoogleAnalytics: gtag script loaded successfully');
        }
        setScriptLoaded(true);
    };

    const handleScriptError = (error: any) => {
        if (isDebugAnalyticsEnabled()) {
            console.error('GoogleAnalytics: Error loading gtag script:', error);
        }
    };

    // Always render the component but conditionally load GA scripts
    return (
        <>
            {shouldLoad && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                        onLoad={handleScriptLoad}
                        onError={handleScriptError}
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                const debugAnalytics = '${process.env.NEXT_PUBLIC_DEBUG_ANALYTICS}' === 'true';
                                if (debugAnalytics) {
                                    console.log('GoogleAnalytics: Initializing gtag with ID: ${GA_MEASUREMENT_ID}');
                                }
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                window.gtag = gtag;
                                gtag('js', new Date());
                                gtag('config', '${GA_MEASUREMENT_ID}', {
                                    anonymize_ip: true,
                                    allow_google_signals: false,
                                    send_page_view: false
                                });
                                if (debugAnalytics) {
                                    console.log('GoogleAnalytics: gtag initialized and available on window.gtag');
                                    console.log('GoogleAnalytics: dataLayer:', window.dataLayer);
                                }
                            `,
                        }}
                    />
                </>
            )}
            {!shouldLoad && (
                <div style={{ display: 'none' }}>
                    GoogleAnalytics: Tracking disabled (consent not given or disabled via env)
                </div>
            )}
        </>
    );
} 