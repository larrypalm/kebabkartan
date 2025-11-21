'use client';

import { useEffect, useState } from 'react';
import { isTrackingEnabled } from '@/app/utils/analytics';

export default function AnalyticsDebug() {
    const [debugInfo, setDebugInfo] = useState<any>({});

    useEffect(() => {
        const updateDebugInfo = () => {
            const info = {
                timestamp: new Date().toISOString(),
                isTrackingEnabled: isTrackingEnabled(),
                hasWindow: typeof window !== 'undefined',
                hasGtag: typeof window !== 'undefined' && !!window.gtag,
                hasDataLayer: typeof window !== 'undefined' && !!window.dataLayer,
                dataLayerLength: typeof window !== 'undefined' && window.dataLayer ? window.dataLayer.length : 0,
                gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
                nodeEnv: process.env.NODE_ENV,
                consentCookie: typeof document !== 'undefined' ? document.cookie.split(';').find(c => c.trim().startsWith('kebabkartan-cookie-consent=')) : null,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
                url: typeof window !== 'undefined' ? window.location.href : null,
            };

            // Add dataLayer contents if available
            if (typeof window !== 'undefined' && window.dataLayer) {
                (info as any).dataLayerContents = window.dataLayer.slice(-5); // Last 5 items
            }

            setDebugInfo(info);
        };

        // Update immediately
        updateDebugInfo();

        // Update every 2 seconds
        const interval = setInterval(updateDebugInfo, 2000);

        return () => clearInterval(interval);
    }, []);

    // Only show in development or when explicitly enabled
    if (process.env.NEXT_PUBLIC_SHOW_ANALYTICS_DEBUG !== 'true') {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 9999,
            fontFamily: 'monospace'
        }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>Analytics Debug</h4>
            <div>
                <strong>Tracking Enabled:</strong> {debugInfo.isTrackingEnabled ? '✅' : '❌'}<br/>
                <strong>gtag Available:</strong> {debugInfo.hasGtag ? '✅' : '❌'}<br/>
                <strong>DataLayer:</strong> {debugInfo.hasDataLayer ? '✅' : '❌'} ({debugInfo.dataLayerLength} items)<br/>
                <strong>GA ID:</strong> {debugInfo.gaMeasurementId || 'Not set'}<br/>
                <strong>Environment:</strong> {debugInfo.nodeEnv}<br/>
                <strong>Consent Cookie:</strong> {debugInfo.consentCookie ? '✅' : '❌'}<br/>
            </div>
            {debugInfo.dataLayerContents && (
                <details style={{ marginTop: '10px' }}>
                    <summary>Recent DataLayer Events</summary>
                    <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
                        {JSON.stringify(debugInfo.dataLayerContents, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}
