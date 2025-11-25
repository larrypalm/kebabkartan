'use client';

import React from 'react';
import Button from './ui/Button';

interface CookieBannerProps {
    onAcceptAll: () => void;
    onAcceptNecessary: () => void;
    onRejectAll: () => void;
    onOpenSettings: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({
    onAcceptAll,
    onAcceptNecessary,
    onRejectAll,
    onOpenSettings
}) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
            <div className="bg-white shadow-2xl max-w-md w-full rounded-2xl overflow-hidden">
                {/* Pink header strip */}
                <div className="h-3 bg-pink-500"></div>
                <div className="p-6">
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-bold text-blue-900">
                            🍪 Vi använder cookies 🍪
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Vi använder cookies för att förbättra din upplevelse och analysera trafik. 
                            Du kan välja vilka cookies du vill acceptera.
                        </p>
                        
                        {/* Action buttons */}
                        <div className="space-y-3">
                            {/* Primary actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={onAcceptAll}
                                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg"
                                >
                                    Acceptera alla
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onRejectAll}
                                    className="flex-1 border-gray-400 text-gray-600 hover:bg-gray-50 font-semibold rounded-lg"
                                >
                                    Avvisa alla
                                </Button>
                            </div>
                            
                            {/* Settings button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onOpenSettings}
                                className="w-full border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold rounded-lg"
                            >
                                Inställningar
                            </Button>
                        </div>
                        
                        {/* Read more link */}
                        <div className="text-center">
                            <button className="text-blue-900 underline text-sm hover:text-blue-700">
                                Läs mer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
