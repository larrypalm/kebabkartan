'use client';

import { useEffect, useState } from 'react';

interface ConsentPreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

interface CookieConsentProps {
    onConsentChange?: (preferences: ConsentPreferences) => void;
}

export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
    const [showBanner, setShowBanner] = useState(true); // Always show for testing
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        necessary: true, // Always true as these are required
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        console.log('CookieConsent: Component mounted');
        // Check if user has already made a choice
        const hasConsent = localStorage.getItem('kebabkartan-cookie-consent');
        console.log('CookieConsent: hasConsent:', hasConsent);
        if (!hasConsent) {
            console.log('CookieConsent: No consent found, showing banner');
            setShowBanner(true);
        } else {
            console.log('CookieConsent: Consent found, loading preferences');
            // Load existing preferences
            const savedPreferences = JSON.parse(hasConsent);
            setPreferences(savedPreferences);
            onConsentChange?.(savedPreferences);
        }
    }, [onConsentChange]);

    const saveConsent = (newPreferences: ConsentPreferences) => {
        setPreferences(newPreferences);
        localStorage.setItem('kebabkartan-cookie-consent', JSON.stringify(newPreferences));
        setShowBanner(false);
        setShowSettings(false);
        onConsentChange?.(newPreferences);
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('consent-updated', { 
            detail: newPreferences 
        }));
    };

    const acceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        saveConsent(allAccepted);
    };

    const acceptNecessary = () => {
        const necessaryOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        saveConsent(necessaryOnly);
    };

    const saveCustomPreferences = () => {
        saveConsent(preferences);
    };

    const openSettings = () => {
        setShowSettings(true);
    };

    const closeSettings = () => {
        setShowSettings(false);
    };

    console.log('CookieConsent: Rendering, showBanner:', showBanner, 'showSettings:', showSettings);

    if (!showBanner && !showSettings) {
        console.log('CookieConsent: Not rendering - no banner or settings');
        return null;
    }

    return (
        <div className="relative">
            {/* Development indicator */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed top-0 right-0 bg-red-500 text-white p-2 text-xs z-50">
                    CookieConsent Active
                </div>
            )}
            
            {/* Backdrop - only for settings modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            )}

            {/* Cookie Banner */}
            {showBanner && (
                <div className="absolute bottom-4 right-4 bg-white border border-gray-200 shadow-xl z-50 p-4 max-w-sm w-full rounded-lg">
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                Vi använder cookies
                            </h3>
                            <p className="text-xs text-gray-600">
                                Vi använder cookies för att förbättra din upplevelse och analysera trafik. 
                                Du kan välja vilka cookies du vill acceptera.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={openSettings}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                            >
                                Inställningar
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={acceptNecessary}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                                >
                                    Nödvändiga
                                </button>
                                <button
                                    onClick={acceptAll}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                                >
                                    Acceptera alla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cookie Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Cookie-inställningar
                                </h2>
                                <button
                                    onClick={closeSettings}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Necessary Cookies */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Nödvändiga cookies</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. 
                                                De kan inte inaktiveras.
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-end px-1">
                                                <div className="w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">Analyscookies</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Hjälper oss att förstå hur besökare interagerar med webbplatsen genom att 
                                                samla in och rapportera information anonymt.
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                                                className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                                                    preferences.analytics 
                                                        ? 'bg-blue-600 justify-end' 
                                                        : 'bg-gray-300 justify-start'
                                                }`}
                                            >
                                                <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Marketing Cookies */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">Marknadsföringscookies</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Används för att spåra besökare på webbplatser. Målet är att visa annonser 
                                                som är relevanta och engagerande för den enskilda användaren.
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                                                className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                                                    preferences.marketing 
                                                        ? 'bg-blue-600 justify-end' 
                                                        : 'bg-gray-300 justify-start'
                                                }`}
                                            >
                                                <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={closeSettings}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Avbryt
                                </button>
                                <button
                                    onClick={saveCustomPreferences}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Spara inställningar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
