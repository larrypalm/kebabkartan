'use client';

import React from 'react';

interface FloatingCookieButtonProps {
    onClick: () => void;
    className?: string;
}

const FloatingCookieButton: React.FC<FloatingCookieButtonProps> = ({ 
    onClick, 
    className = '' 
}) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-[9997] transition-colors duration-200 ${className}`}
            style={{ zIndex: 9997 }}
            title="Cookie-inställningar"
            aria-label="Öppna cookie-inställningar"
        >
            <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" 
                />
            </svg>
        </button>
    );
};

export default FloatingCookieButton;
