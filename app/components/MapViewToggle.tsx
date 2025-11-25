'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MaterialIcon } from './Icons';
import RestaurantCard from './ui/RestaurantCard';

// Dynamically import Map to avoid SSR issues
const Map = dynamic(
    () => import('./Map'),
    { ssr: false }
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
    openingHours?: string;
    priceRange?: string;
    city?: string;
    slug?: string;
}

interface MapViewToggleProps {
    initialPlaceSlug?: string | null;
    initialCenter?: [number, number];
    initialZoom?: number;
    viewMode?: 'map' | 'list';
    searchQuery?: string;
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

export default function MapViewToggle({
    initialPlaceSlug = null,
    initialCenter,
    initialZoom,
    viewMode = 'map',
    searchQuery = ''
}: MapViewToggleProps) {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);

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

        if (viewMode === 'list') {
            fetchLocations();
        }
    }, [viewMode]);

    // Filter locations based on search query
    const filteredLocations = useMemo(() => {
        if (!searchQuery) return locations;

        const query = searchQuery.toLowerCase();
        return locations.filter(location =>
            location.name.toLowerCase().includes(query) ||
            location.address.toLowerCase().includes(query) ||
            (location.city && location.city.toLowerCase().includes(query))
        );
    }, [locations, searchQuery]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>

            {/* List View */}
            {viewMode === 'list' && (
                <div 
                    style={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                        background: '#F7F5F2',
                        padding: '1rem'
                    }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 rounded-2xl"
                >
                    {loading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#6B7280'
                        }}>
                            Laddar restauranger...
                        </div>
                    ) : (
                        <div style={{
                            maxWidth: '1200px',
                            margin: '0 auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '20px'
                        }}>
                            {filteredLocations.length === 0 ? (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#6B7280'
                                }}>
                                    {searchQuery ? 'Inga restauranger matchade din sökning' : 'Inga restauranger hittades'}
                                </div>
                            ) : (
                                filteredLocations.map((location) => (
                                    <RestaurantCard
                                        key={location.id}
                                        id={location.id}
                                        name={location.name}
                                        address={location.address}
                                        city={location.city || extractCityFromAddress(location.address)}
                                        rating={location.rating}
                                        sauceRating={location.sauceRating || location.rating}
                                        reviewCount={location.totalVotes}
                                        priceRange={location.priceRange}
                                        slug={location.slug}
                                        variant="default"
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
                <Map
                    initialPlaceSlug={initialPlaceSlug}
                    initialCenter={initialCenter}
                    initialZoom={initialZoom}
                />
            )}
        </div>
    );
}
