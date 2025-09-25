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
            <span className="cluster-emoji" aria-hidden="true" style={{fontSize: '54px !important'}}>🍪</span>
        </button>
    );
};

export default FloatingCookieButton;
