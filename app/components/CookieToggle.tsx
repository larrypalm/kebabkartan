'use client';

import React from 'react';

interface CookieToggleProps {
    title: string;
    description: string;
    isEnabled: boolean;
    isDisabled?: boolean;
    onToggle: () => void;
}

const CookieToggle: React.FC<CookieToggleProps> = ({
    title,
    description,
    isEnabled,
    isDisabled = false,
    onToggle
}) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {description}
                    </p>
                </div>
                <div className="ml-4">
                    <button
                        onClick={onToggle}
                        disabled={isDisabled}
                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-200 ease-in-out ${
                            isEnabled 
                                ? 'bg-blue-600 justify-end' 
                                : 'bg-gray-300 justify-start'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                        aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${title}`}
                    >
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieToggle;
