'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';

export interface City {
  name: string;
  path: string;
  coordinates: [number, number];
}

export interface CityNavigationProps {
  cities: City[];
  onCityClick?: (city: City) => void;
  className?: string;
  style?: React.CSSProperties;
}

const CityNavigation: React.FC<CityNavigationProps> = ({
  cities,
  onCityClick,
  className = '',
  style
}) => {
  const router = useRouter();

  const handleCityClick = (city: City) => {
    router.push(city.path);
    onCityClick?.(city);
  };

  return (
    <div 
      className={`flex flex-col gap-2 ${className}`}
      style={style}
    >
      <div className="text-xs font-semibold text-gray-500 text-center mb-1">
        Populära städer
      </div>
      {cities.map((city) => (
        <button
          key={city.path}
          onClick={() => handleCityClick(city)}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#9ca3af';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
        >
          {city.name}
        </button>
      ))}
    </div>
  );
};

export default CityNavigation;
