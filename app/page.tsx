"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import "./app.css";
import "@aws-amplify/ui-react/styles.css";
import dynamic from "next/dynamic";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";
import { useAuth } from "./contexts/AuthContext";
import { MaterialIcon } from "./components/Icons";
import { useRouter } from "next/navigation";
import { createRestaurantSlug } from "./lib/slugUtils";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    sauceRating?: number;
    totalVotes: number;
    city?: string;
    slug?: string;
}

export default function App() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const MapViewToggle = useMemo(() => dynamic(
        () => import('./components/MapViewToggle'),
        {
            loading: () => (
                <div className="flex items-center justify-center h-96 bg-background-light">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                        <p className="text-slate-700 font-medium">Kebabkartan laddar...</p>
                    </div>
                </div>
            ),
            ssr: false
        }
    ), []);

    // Fetch locations for search
    useEffect(() => {
        const fetchLocations = async () => {
            setLoadingLocations(true);
            try {
                const response = await fetch('/api/kebab-places');
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoadingLocations(false);
            }
        };

        fetchLocations();
    }, []);

    // Filter locations based on search query
    const filteredLocations = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        return locations
            .filter(location =>
                location.name.toLowerCase().includes(query) ||
                location.address.toLowerCase().includes(query) ||
                (location.city && location.city.toLowerCase().includes(query))
            )
            .slice(0, 5); // Limit to 5 results
    }, [locations, searchQuery]);

    // Show dropdown when there's a query and results
    useEffect(() => {
        setShowSearchDropdown(searchQuery.trim().length > 0 && filteredLocations.length > 0);
    }, [searchQuery, filteredLocations]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle search result click
    const handleSearchResultClick = (location: Location) => {
        const slug = location.slug || createRestaurantSlug(location.name, location.city || location.address);
        router.push(`/${slug}`);
        setSearchQuery('');
        setShowSearchDropdown(false);
    };

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            {/* Header Navigation */}
            <Header
                isLoggedIn={!!user}
                userName={user?.username}
                onSearch={(query) => {
                    setSearchQuery(query);
                }}
                onLoginClick={() => {
                    window.location.href = '/login';
                }}
                onProfileClick={() => {
                    window.location.href = '/profil';
                }}
                onLogoutClick={() => {
                    window.location.href = '/logout';
                }}
            />

            <main role="main" className="relative bg-background-light">
                {/* Hero Section */}
                <div className="bg-white border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                            Hitta Sveriges <span className="text-primary">bästa kebab</span>
                        </h1>
                        <p className="text-lg text-text-muted mb-8">
                            Upptäck pizzerior med de bästa såserna nära dig
                        </p>

                        {/* Centered Search Bar */}
                        <div className="max-w-2xl mx-auto" ref={searchRef}>
                            <div className="relative">
                                <MaterialIcon
                                    name="search"
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl z-10"
                                />
                                <input
                                    type="text"
                                    placeholder="Sök restaurang eller stad..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (filteredLocations.length > 0) {
                                            setShowSearchDropdown(true);
                                        }
                                    }}
                                    className="w-full pl-12 pr-4 py-4 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />

                                {/* Search Dropdown */}
                                {showSearchDropdown && (
                                    <div id="search-results" className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                                        {filteredLocations.map((location) => (
                                            <button
                                                key={location.id}
                                                onClick={() => handleSearchResultClick(location)}
                                                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <MaterialIcon
                                                        name="restaurant"
                                                        className="text-primary mt-1"
                                                        size="sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-slate-900 truncate">
                                                            {location.name}
                                                        </div>
                                                        <div className="text-sm text-slate-600 truncate">
                                                            {location.address}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-1">
                                                                <MaterialIcon
                                                                    name="star"
                                                                    fill
                                                                    className="text-primary"
                                                                    size="sm"
                                                                />
                                                                <span className="text-sm font-medium text-slate-700">
                                                                    {location.rating.toFixed(1)}
                                                                </span>
                                                            </div>
                                                            {location.sauceRating && (
                                                                <div className="flex items-center gap-1">
                                                                    <MaterialIcon
                                                                        name="favorite"
                                                                        fill
                                                                        className="text-secondary"
                                                                        size="sm"
                                                                    />
                                                                    <span className="text-sm font-medium text-slate-700">
                                                                        {location.sauceRating.toFixed(1)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Results Count */}
                        <div className="flex items-center gap-2 text-slate-700">
                            <MaterialIcon name="location_on" className="text-primary" size="sm" />
                            <span className="font-medium">9 ställen hittades</span>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-slate-100 text-slate-900 font-medium'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <MaterialIcon name="list" size="sm" />
                                <span className="text-sm">Lista</span>
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                    viewMode === 'map'
                                        ? 'bg-slate-100 text-slate-900 font-medium'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <MaterialIcon name="map" size="sm" />
                                <span className="text-sm">Karta</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map/List View */}
                <div className="h-[calc(100vh-400px)] min-h-[500px]">
                    <MapViewToggle
                        initialPlaceSlug={null}
                        viewMode={viewMode}
                        searchQuery={searchQuery}
                    />
                </div>
            </main>

            {/* Bottom Navigation for Mobile */}
            <BottomNavigation />
        </GoogleReCaptchaProvider>
    );
}
