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
        const savedPreferences = getConsentPreferences();

        if (!savedPreferences) {
            setShowBanner(true);
        } else {
            setPreferences(savedPreferences);
            setShowBanner(false); // Hide banner since consent exists
            onConsentChange?.(savedPreferences);
        }
    }, [onConsentChange]);

    const saveConsent = (newPreferences: ConsentPreferences) => {
        setPreferences(newPreferences);
        saveConsentPreferences(newPreferences, 30);
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
        setShowSettings(true);
    };

    const closeSettings = () => {
        setShowSettings(false);
    };

    const openConsentBanner = () => {
        setShowBanner(true);
    };


    // Render nothing on server
    if (!isMounted) return null;

    const content = (
        <>
            {/* Floating button */}
            {!showBanner && (
                <FloatingCookieButton onClick={openConsentBanner} />
            )}

            {/* Cookie Banner - hide when settings are open */}
            {showBanner && !showSettings && (
                <CookieBanner
                    onAcceptAll={acceptAll}
                    onAcceptNecessary={acceptNecessary}
                    onRejectAll={rejectAll}
                    onOpenSettings={openSettings}
                />
            )}

            {/* Settings modal */}
            {showBanner && (
                <CookieSettingsModal
                    isOpen={showSettings}
                    onClose={closeSettings}
                    preferences={preferences}
                    onPreferencesChange={setPreferences}
                    onSave={saveCustomPreferences}
                />
            )}
        </>
    );

    // Use portal to ensure overlay sits above all app layers
    return createPortal(content, document.body);
}
