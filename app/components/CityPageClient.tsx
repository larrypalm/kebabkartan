'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Header from '@/app/components/layout/Header';
import BottomNavigation from '@/app/components/layout/BottomNavigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { MaterialIcon } from '@/app/components/Icons';
import RestaurantCard from '@/app/components/ui/RestaurantCard';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

// Dynamically import Map to avoid SSR issues
const Map = dynamic(
  () => import('@/app/components/Map'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-background-light">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-slate-700 font-medium">Kartan laddar...</p>
        </div>
      </div>
    )
  }
);

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  sauceRating?: number;
  totalVotes: number;
  reviewCount?: number;
  openingHours?: string;
  priceRange?: string;
  city?: string;
  slug?: string;
}

interface CityPageClientProps {
  cityName: string;
  description: string;
  initialCenter: [number, number];
  initialZoom: number;
}

const extractCityFromAddress = (address: string): string => {
  const cities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Jönköping', 'Lund', 'Umeå', 'Västerås', 'Örebro'];

  for (const city of cities) {
    if (address.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }

  const parts = address.split(',').map(part => part.trim());
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }

  return 'Sverige';
};

const CityPageClient: React.FC<CityPageClientProps> = ({
  cityName,
  description,
  initialCenter,
  initialZoom,
}) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/kebab-places');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations for this city
  const cityLocations = useMemo(() => {
    return locations.filter((location: Location) =>
      location.city?.toLowerCase().includes(cityName.toLowerCase()) ||
      location.address?.toLowerCase().includes(cityName.toLowerCase())
    );
  }, [locations, cityName]);

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      {/* Header Navigation */}
      <Header
        onSearch={(query) => {
          console.log('Search:', query);
        }}
      />

      <main role="main" className="relative bg-background-light min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <a href="/" className="hover:text-primary transition-colors">
                Kebabkartan.se
              </a>
              <span>/</span>
              <span>Sverige</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">{cityName}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              Bästa Kebab & Pizza i <span className="text-primary">{cityName}</span>
            </h1>
            <p className="text-base md:text-lg text-text-muted mb-6 max-w-3xl">
              {description}
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white border-b border-slate-200 sticky top-[64px] z-10 md:relative md:top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Results Count */}
              <div className="flex items-center gap-2 text-slate-700">
                <MaterialIcon name="location_on" className="text-primary" size="sm" />
                <span className="font-medium">
                  {loading ? 'Laddar...' : `${cityLocations.length} ${cityLocations.length === 1 ? 'ställe' : 'ställen'} hittades`}
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 font-medium shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="Visa som lista"
                >
                  <MaterialIcon name="list" size="sm" />
                  <span className="text-sm hidden sm:inline">Lista</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md transition-all ${
                    viewMode === 'map'
                      ? 'bg-white text-slate-900 font-medium shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="Visa på karta"
                >
                  <MaterialIcon name="map" size="sm" />
                  <span className="text-sm hidden sm:inline">Karta</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map/List View */}
        <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-320px)] min-h-[400px]">
          {/* List View */}
          {viewMode === 'list' && (
            <div className="h-full overflow-y-auto bg-background-light">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                    <p className="text-slate-700 font-medium">Laddar restauranger...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {cityLocations.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <MaterialIcon name="restaurant" className="text-slate-300 text-6xl mb-4" />
                        <p className="text-lg text-text-muted">
                          Inga restauranger hittades i {cityName}
                        </p>
                      </div>
                    ) : (
                      cityLocations.map((location) => (
                        <RestaurantCard
                          key={location.id}
                          id={location.id}
                          name={location.name}
                          address={location.address}
                          city={location.city || extractCityFromAddress(location.address)}
                          rating={location.rating}
                          sauceRating={location.sauceRating || location.rating}
                          reviewCount={location.reviewCount || location.totalVotes}
                          priceRange={location.priceRange}
                          openingHours={location.openingHours}
                          slug={location.slug}
                          variant="default"
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="h-full w-full">
              <Map
                key={`map-${cityName}`}
                initialPlaceSlug={null}
                initialCenter={initialCenter}
                initialZoom={initialZoom}
              />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </GoogleReCaptchaProvider>
  );
};

export default CityPageClient;
