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
    onOpenSettings,
}) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
            <div className="bg-white shadow-2xl max-w-md w-full rounded-2xl overflow-hidden">
                {/* Pink header strip */}
                <div className="h-3 bg-pink-500"></div>
                
                {/* Cookie illustration */}
                <div className="flex justify-center -mt-6 mb-4">
                    <div className="relative">
                        {/* Cookie character */}
                        <div className="w-16 h-16 bg-amber-200 rounded-full relative shadow-lg">
                            {/* Cookie bite */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full"></div>
                            
                            {/* Chocolate chips */}
                            <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-amber-800 rounded-full"></div>
                            <div className="absolute top-5 right-4 w-1.5 h-1.5 bg-amber-800 rounded-full"></div>
                            <div className="absolute bottom-4 left-5 w-1.5 h-1.5 bg-amber-800 rounded-full"></div>
                            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-amber-800 rounded-full"></div>
                            
                            {/* Face */}
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                                {/* Eyes */}
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                </div>
                            </div>
                            
                            {/* Mouth */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black rounded-full"></div>
                            
                            {/* Blush */}
                            <div className="absolute top-3 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                            <div className="absolute top-3 right-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                            
                            {/* Arms and legs */}
                            <div className="absolute -left-2 top-4 w-3 h-1 bg-amber-200 rounded-full"></div>
                            <div className="absolute -right-2 top-4 w-3 h-1 bg-amber-200 rounded-full"></div>
                            <div className="absolute -bottom-1 left-3 w-1 h-3 bg-amber-200 rounded-full"></div>
                            <div className="absolute -bottom-1 right-3 w-1 h-3 bg-amber-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 pb-6">
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-bold text-blue-900">
                            Vi använder cookies
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
