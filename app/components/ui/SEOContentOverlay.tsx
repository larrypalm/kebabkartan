'use client';

import React from 'react';

export interface SEOContentOverlayProps {
  cityName: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

const SEOContentOverlay: React.FC<SEOContentOverlayProps> = ({
  cityName,
  description,
  className = '',
  style
}) => {
  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    ...style
  };

  return (
    <div style={defaultStyle} className={className}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        margin: '0 0 8px 0',
        color: '#1f2937'
      }}>
        Bästa Kebab i {cityName}
      </h1>
      <p style={{ 
        fontSize: '14px', 
        color: '#6b7280', 
        margin: '0 0 12px 0',
        lineHeight: '1.4'
      }}>
        {description}
      </p>
      
      {/* Quick info */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
        <span>✓ Verifierade recensioner</span>
        <span>✓ Uppdaterade betyg</span>
        <span>✓ Interaktiv karta</span>
      </div>
    </div>
  );
};

export default SEOContentOverlay;
