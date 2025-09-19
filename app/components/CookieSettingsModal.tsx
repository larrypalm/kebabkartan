'use client';

import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import CookieToggle from './CookieToggle';
import { ConsentPreferences } from '@/app/utils/cookies';

interface CookieSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    preferences: ConsentPreferences;
    onPreferencesChange: (preferences: ConsentPreferences) => void;
    onSave: () => void;
}

const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({
    isOpen,
    onClose,
    preferences,
    onPreferencesChange,
    onSave
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Cookie-inställningar"
            size="lg"
            className="max-h-[90vh] overflow-y-auto"
        >
            <div className="space-y-6">
                {/* Necessary Cookies */}
                <CookieToggle
                    title="Nödvändiga cookies"
                    description="Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. De kan inte inaktiveras."
                    isEnabled={preferences.necessary}
                    isDisabled={true}
                    onToggle={() => {}} // No-op since it's disabled
                />

                {/* Analytics Cookies */}
                <CookieToggle
                    title="Analyscookies"
                    description="Hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla in och rapportera information anonymt."
                    isEnabled={preferences.analytics}
                    onToggle={() => onPreferencesChange({ 
                        ...preferences, 
                        analytics: !preferences.analytics,
                        necessary: true // Always ensure necessary is true
                    })}
                />

                {/* Marketing Cookies */}
                <CookieToggle
                    title="Marknadsföringscookies"
                    description="Används för att spåra besökare på webbplatser. Målet är att visa annonser som är relevanta och engagerande för den enskilda användaren."
                    isEnabled={preferences.marketing}
                    onToggle={() => onPreferencesChange({ 
                        ...preferences, 
                        marketing: !preferences.marketing,
                        necessary: true // Always ensure necessary is true
                    })}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                >
                    Avbryt
                </Button>
                <Button
                    variant="primary"
                    onClick={onSave}
                    className="flex-1"
                >
                    Spara inställningar
                </Button>
            </div>
        </Modal>
    );
};

export default CookieSettingsModal;
