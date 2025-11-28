'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Header from '@/app/components/layout/Header';
import BottomNavigation from '@/app/components/layout/BottomNavigation';
import { Footer } from '@/app/components/layout/Footer';
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

interface TopListClientProps {
  title: string;
  description: string;
  sortBy: 'rating' | 'sauceRating';
  cityFilter?: string; // Filter by city name if provided
  breadcrumbs: { label: string; href?: string }[];
  initialCenter?: [number, number]; // Map center coordinates
  initialZoom?: number; // Map zoom level
}

const TopListClient: React.FC<TopListClientProps> = ({
  title,
  description,
  sortBy,
  cityFilter,
  breadcrumbs,
  initialCenter,
  initialZoom,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

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

  // Filter and sort locations
  const sortedLocations = useMemo(() => {
    let filtered = locations;

    // Filter by city if specified
    if (cityFilter) {
      filtered = locations.filter((location: Location) =>
        location.city?.toLowerCase().includes(cityFilter.toLowerCase()) ||
        location.address?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    // Sort by the specified field
    return [...filtered].sort((a, b) => {
      const aValue = sortBy === 'sauceRating' ? (a.sauceRating || 0) : a.rating;
      const bValue = sortBy === 'sauceRating' ? (b.sauceRating || 0) : b.rating;
      return bValue - aValue; // Descending order (highest first)
    });
  }, [locations, sortBy, cityFilter]);

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <Header showSearch={false} />

      <main role="main" className="relative bg-background-light min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-slate-900 font-medium">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              {title}
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
                  {loading ? 'Laddar...' : `${sortedLocations.length} ${sortedLocations.length === 1 ? 'restaurang' : 'restauranger'} hittades`}
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
                    <p className="text-slate-700 font-medium">Laddar topplistor...</p>
                  </div>
                ) : sortedLocations.length === 0 ? (
                  <div className="text-center py-12">
                    <MaterialIcon name="restaurant" className="text-slate-300 text-6xl mb-4" />
                    <h3 className="text-xl font-medium text-slate-900 mb-2">
                      Inga restauranger hittades
                    </h3>
                    <p className="text-text-muted">
                      {cityFilter
                        ? `Vi hittade inga restauranger i ${cityFilter} för tillfället.`
                        : 'Vi hittade inga restauranger för tillfället.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedLocations.map((location, index) => (
                      <div key={location.id} className="relative">
                        {/* Rank Badge */}
                        <div className="absolute -top-3 -left-3 z-10 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <RestaurantCard
                          id={location.id}
                          name={location.name}
                          address={location.address}
                          city={location.city}
                          rating={location.rating}
                          sauceRating={location.sauceRating || 0}
                          reviewCount={location.reviewCount || 0}
                          priceRange={location.priceRange}
                          openingHours={location.openingHours}
                          slug={location.slug}
                          variant="default"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="h-full w-full">
              <Map
                key="toplist-map"
                initialPlaceSlug={null}
                initialCenter={initialCenter || [62.5, 16.5]}
                initialZoom={initialZoom || 5}
              />
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </GoogleReCaptchaProvider>
  );
};

export default TopListClient;
