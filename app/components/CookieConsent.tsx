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
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                right: showBanner ? '10px' : 'auto',
                left: '10px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 9999,
                fontFamily: 'monospace'
            }}
        >
            {/* Floating button */}
            {!showBanner && <div className="pointer-events-auto">
                <FloatingCookieButton onClick={openConsentBanner} />
            </div>}

            {/* Cookie Banner */}
            {showBanner && (
                <div className="pointer-events-auto">
                    <CookieBanner
                        onAcceptAll={acceptAll}
                        onAcceptNecessary={acceptNecessary}
                        onRejectAll={rejectAll}
                        onOpenSettings={openSettings}
                    />
                </div>
            )}

            {/* Settings modal */}
            {showBanner && (
                <div className="pointer-events-auto">
                    <CookieSettingsModal
                        isOpen={showSettings}
                        onClose={closeSettings}
                        preferences={preferences}
                        onPreferencesChange={setPreferences}
                        onSave={saveCustomPreferences}
                    />
                </div>
            )}
        </div>
    );
    // Use portal to ensure overlay sits above all app layers
    return createPortal(content, document.body);
}
