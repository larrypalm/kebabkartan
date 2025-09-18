'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import SEOContentOverlay from './SEOContentOverlay';

const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <p>Kartan laddar...</p>
});

export interface CityPageLayoutProps {
  cityName: string;
  description: string;
  initialCenter: [number, number];
  initialZoom: number;
  className?: string;
  style?: React.CSSProperties;
}

const CityPageLayout: React.FC<CityPageLayoutProps> = ({
  cityName,
  description,
  initialCenter,
  initialZoom,
  className = '',
  style
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    ...style
  };

  return (
    <div style={containerStyle} className={className}>
      <SEOContentOverlay
        cityName={cityName}
        description={description}
      />
      
      <Map 
        initialPlaceId={null} 
        initialCenter={initialCenter} 
        initialZoom={initialZoom} 
      />
    </div>
  );
};

export default CityPageLayout;
