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
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isEnabled 
                                ? 'bg-blue-600' 
                                : 'bg-gray-300'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${title}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                        {isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieToggle;
