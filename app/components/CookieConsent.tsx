'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
    getConsentPreferences, 
    saveConsentPreferences, 
    ConsentPreferences 
} from '@/app/utils/cookies';
import CookieBanner from './CookieBanner';
import CookieSettingsModal from './CookieSettingsModal';
import FloatingCookieButton from './FloatingCookieButton';

interface CookieConsentProps {
    onConsentChange?: (preferences: ConsentPreferences) => void;
}

export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        necessary: true, // Always true as these are required
        analytics: false,
        marketing: false,
    });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        console.log('CookieConsent: Component mounted');
        
        const savedPreferences = getConsentPreferences();
        console.log('CookieConsent: Saved preferences:', savedPreferences);
        console.log('CookieConsent: All cookies:', document.cookie);
        
        if (!savedPreferences) {
            console.log('CookieConsent: No consent preferences found, showing banner');
            setShowBanner(true);
        } else {
            console.log('CookieConsent: Consent preferences found, loading preferences');
            setPreferences(savedPreferences);
            setShowBanner(false); // Hide banner since consent exists
            onConsentChange?.(savedPreferences);
        }
    }, [onConsentChange]);

    const saveConsent = (newPreferences: ConsentPreferences) => {
        setPreferences(newPreferences);
        saveConsentPreferences(newPreferences);
        setShowBanner(false);
        setShowSettings(false);
        onConsentChange?.(newPreferences);
        
        // Force a re-check of tracking status after a short delay
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('consent-updated', { 
                detail: newPreferences 
            }));
        }, 50);
    };

    const acceptAll = () => {
        const allAccepted = {
            necessary: true, // Always true - required for basic functionality
            analytics: true,
            marketing: true,
        };
        saveConsent(allAccepted);
    };

    const acceptNecessary = () => {
        const necessaryOnly = {
            necessary: true, // Always true - required for basic functionality
            analytics: false,
            marketing: false,
        };
        saveConsent(necessaryOnly);
    };

    const rejectAll = () => {
        const rejected = {
            necessary: true, // Always true - required for basic functionality
            analytics: false,
            marketing: false,
        };
        saveConsent(rejected);
    };

    const saveCustomPreferences = () => {
        // Ensure necessary cookies are always true
        const customPreferences = {
            ...preferences,
            necessary: true, // Always true - required for basic functionality
        };
        saveConsent(customPreferences);
    };

    const openSettings = () => {
        setShowSettings(!showSettings);
    };

    const closeSettings = () => {
        setShowSettings(false);
    };

    const openConsentBanner = () => {
        setShowBanner(true);
    };

    const closeConsentBanner = () => {
        setShowBanner(false);
    };

    console.log('CookieConsent: Rendering, showBanner:', showBanner, 'showSettings:', showSettings);

    // Render nothing on server
    if (!isMounted) return null;

    const showBannerStyle = {
        zIndex: 99999,
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white'
    };

    const hideBannerStyle = {
        zIndex: 99999,
        position: 'fixed' as const,
        right: 0,
        bottom: 0,
        background: 'white'
    };

    const content = (
        <div style={showBanner ? showBannerStyle : hideBannerStyle}>
            {/* Floating Cookie Settings Button */}
            {!showBanner && <FloatingCookieButton onClick={openConsentBanner} />}

            {/* Cookie Banner */}
            {showBanner && (
                <CookieBanner
                    onAcceptAll={acceptAll}
                    onAcceptNecessary={acceptNecessary}
                    onRejectAll={rejectAll}
                    onOpenSettings={openSettings}
                />
            )}

            {/* Cookie Settings Modal */}
            <CookieSettingsModal
                isOpen={showSettings}
                onClose={closeSettings}
                preferences={preferences}
                onPreferencesChange={setPreferences}
                onSave={saveCustomPreferences}
            />
        </div>
    );

    // Use portal to ensure overlay sits above all app layers
    return createPortal(content, document.body);
}
