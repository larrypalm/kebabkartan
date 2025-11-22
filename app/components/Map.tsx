'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { trackKebabPlaceView, trackRatingSubmitted, trackSearch, trackSearchResultSelect, trackMarkerClick, trackMarkerShare, trackMarkerExpand, trackMapLoaded, trackIpLocationSuccess, trackIpLocationError, trackGeolocationPermission, trackRatingSubmitAttempt, trackRatingSubmitError, trackSearchOpen, trackSearchClear } from '@/app/utils/analytics';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from './Header';
import { MobileMenuProvider, useMobileMenu } from '@/app/contexts/MobileMenuContext';

// Helper function to extract city from address
const extractCityFromAddress = (address: string): string => {
    // Common Swedish cities to look for
    const cities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Jönköping', 'Lund', 'Umeå', 'Västerås', 'Örebro'];
    
    for (const city of cities) {
        if (address.toLowerCase().includes(city.toLowerCase())) {
            return city;
        }
    }
    
    // If no known city found, try to extract the last part of the address
    const parts = address.split(',').map(part => part.trim());
    if (parts.length > 1) {
        return parts[parts.length - 1];
    }
    
    return 'Sverige';
};

interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    totalVotes: number;
    openingHours?: string;
    priceRange?: string;
    city?: string;
    slug?: string;
}

interface RatingStarsProps {
    placeId: string;
    currentRating: number;
    totalVotes: number;
}

interface MapProps {
    initialPlaceSlug?: string | null;
    initialCenter?: [number, number];
    initialZoom?: number;
}

interface ZoomableMarkerProps {
    location: Location;
    onClickLocation: (location: Location | null) => void;
    isSelected: boolean;
}

interface SetViewOnSelectProps {
    lat: number;
    lng: number;
}

interface Coordinates {
    latitude: number;
    longitude: number;
    zoom: number;
}

// Sweden's bounding box coordinates
const SWEDEN_VIEW: Coordinates = {
    latitude: 62.5,  // Center of Sweden approximately
    longitude: 16.5,
    zoom: 5
};

const MAP_PLACEHOLDER = '/static/map-placeholder.png'; // Place a suitable image in public/static/

const RatingStars: React.FC<RatingStarsProps> = ({ placeId, currentRating, totalVotes }) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submittingRating, setSubmittingRating] = useState<number | null>(null);
    const [userVote, setUserVote] = useState<number | null>(null);
    const [loadingVote, setLoadingVote] = useState<boolean>(false);
    const fetchingRef = useRef<boolean>(false);

    // Memoize the username to prevent unnecessary re-renders
    const username = useMemo(() => user?.username, [user?.username]);

    // Fetch user's vote for this place
    useEffect(() => {
        const fetchUserVote = async () => {
            if (!username) {
                setUserVote(null);
                return;
            }

            // Prevent multiple simultaneous requests
            if (fetchingRef.current) {
                return;
            }

            fetchingRef.current = true;
            setLoadingVote(true);
            try {
                const response = await fetch(`/api/user-votes/${placeId}?userId=${encodeURIComponent(username)}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserVote(data.vote?.rating || null);
                }
            } catch (error) {
                console.error('Error fetching user vote:', error);
            } finally {
                setLoadingVote(false);
                fetchingRef.current = false;
            }
        };

        // Only fetch if we have a valid username
        if (username) {
            fetchUserVote();
        } else {
            setUserVote(null);
        }
    }, [username, placeId]); // Only depend on memoized username and placeId

    const handleRating = async (rating: number) => {
        if (isSubmitting) return;

        // Check if user is authenticated
        if (!user) {
            const shouldSignIn = confirm('Du behöver logga in för att rösta på kebabställen. Vill du logga in nu?');
            if (shouldSignIn) {
                router.push('/auth');
            }
            return;
        }

        // Check if user is trying to vote the same rating they already have
        if (userVote === rating) {
            return; // Don't submit if it's the same vote
        }

        if (!executeRecaptcha) {
            alert("reCAPTCHA är inte redo. Försök igen om en stund.");
            return;
        }

        setIsSubmitting(true);
        trackRatingSubmitAttempt(placeId, rating);
        setSubmittingRating(rating);

        try {
            const token = await executeRecaptcha('submit_rating');

            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placeId,
                    rating,
                    recaptchaToken: token,
                    userId: user.username,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                trackRatingSubmitError(placeId, rating, errorText || 'Misslyckades att uppdatera betyg');
                throw new Error(errorText || 'Misslyckades att uppdatera betyg');
            }

            // Track the rating submission
            trackRatingSubmitted(placeId, 'Kebab Place', rating);

            // Update user vote state
            setUserVote(rating);

            window.location.reload();
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Misslyckades att uppdatera betyg. Försök igen.');
        } finally {
            setIsSubmitting(false);
            setSubmittingRating(null);
        }
    };

    return (
        <div className="rating-container">
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = isSubmitting && submittingRating === star;
                    const isDimmed = isSubmitting && submittingRating !== star;
                    const isAuthenticated = !!user;
                    const isAlreadyVoted = userVote === star;
                    const isCurrentVote = userVote && star <= userVote;
                    return (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => handleRating(star)}
                            disabled={isSubmitting}
                            className={isActive ? 'loading' : ''}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: isSubmitting ? 'default' : (isAuthenticated ? (isAlreadyVoted ? 'not-allowed' : 'pointer') : 'pointer'),
                                fontSize: '24px',
                                padding: '0 2px',
                                opacity: isActive ? 1 : isDimmed ? 0.3 : 1,
                                transition: 'opacity 0.2s',
                                filter: !isAuthenticated ? 'grayscale(0.3)' : 'none'
                            }}
                            title={!isAuthenticated ? 'Logga in för att rösta' : (isAlreadyVoted ? 'Du har redan röstat denna betyg' : `Betygsätt ${star} stjärn${star > 1 ? 'or' : 'a'}`)}
                        >
                            {(isActive || star <= (hoveredRating || userVote || currentRating)) ? '❤️' : '🤍'}
                        </button>
                    );
                })}
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Genomsnittsbetyg: {currentRating.toFixed(1)} ({totalVotes} röster)
            </div>
            {user && userVote && (
                <div style={{ 
                    fontSize: '10px', 
                    marginTop: '2px', 
                    color: '#e74c3c',
                    fontWeight: 'bold'
                }}>
                    Ditt betyg: {userVote} stjärn{userVote > 1 ? 'or' : 'a'}
                </div>
            )}
            {!user && (
                <div style={{ 
                    fontSize: '10px', 
                    marginTop: '2px', 
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    Logga in för att rösta
                </div>
            )}
        </div>
    );
};

const SetViewOnSelect: React.FC<SetViewOnSelectProps> = ({ lat, lng }) => {
    const map = useMap();
    
    useEffect(() => {
        map.setView([lat, lng], 15);
    }, [lat, lng, map]);
    
    return null;
};

const ZoomableMarker: React.FC<ZoomableMarkerProps> = React.memo(({ location, onClickLocation, isSelected }) => {
    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleClick = (e: L.LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();
        map.setView([location.latitude, location.longitude], 15);
        onClickLocation(location);
        trackMarkerClick(location.id, location.name);
    };

    const handlePopupClose = () => {
        // Don't automatically reset location on popup close
        // This prevents URL flashing when markers are clicked
        // The location will only be reset when explicitly clicking elsewhere
    };

    // Handle automatic popup opening/closing
    useEffect(() => {
        if (isSelected && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [isSelected]);

    // Add effect to handle popup close event
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.on('popupclose', handlePopupClose);
        }
        return () => {
            if (markerRef.current) {
                markerRef.current.off('popupclose', handlePopupClose);
            }
        };
    }, []);

    // Reset expansion state when marker is deselected
    useEffect(() => {
        if (!isSelected) {
            setIsExpanded(false);
        }
    }, [isSelected]);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Use admin-defined slug
        const slug = location.slug;
        const url = `${window.location.origin}/restaurang/${slug}`;
        
        if (navigator.share) {
            navigator.share({
                title: `Kebabkartan - ${location.name}`,
                text: `Kolla in ${location.name} på Kebabkartan!`,
                url: url,
            }).then(() => trackMarkerShare(location.id, location.name, 'webshare'))
              .catch(console.error);
        } else {
            navigator.clipboard.writeText(url)
                .then(() => { 
                    alert('Länk kopierad till urklipp!');
                    trackMarkerShare(location.id, location.name, 'clipboard');
                })
                .catch(console.error);
        }
    };

    const handleExpandToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !isExpanded;
        setIsExpanded(next);
        trackMarkerExpand(location.id, location.name, next);
    };

    const pizzaIcon = useMemo(
        () =>
            L.icon({
                iconUrl:
                    'data:image/svg+xml;charset=UTF-8,' +
                    encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32">🍕</text>
              </svg>`
                    ),
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
            }),
        []
    );

    return (
        <Marker 
            ref={markerRef}
            position={[location.latitude, location.longitude]} 
            icon={pizzaIcon} 
            eventHandlers={{ click: handleClick }}
        >
            <Popup maxWidth={isExpanded ? 350 : 250} minWidth={isExpanded ? 350 : 200}>
                <div style={{ 
                    padding: '12px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ 
                                fontSize: '16px', 
                                fontWeight: 'bold', 
                                margin: '0 0 4px 0',
                                color: '#333'
                            }}>
                                {location.name}
                            </h3>
                            <p style={{ 
                                fontSize: '12px', 
                                color: '#666', 
                                margin: '0',
                                lineHeight: '1.3'
                            }}>
                                {location.address}
                            </p>
                        </div>
                        <button
                            onClick={handleExpandToggle}
                            style={{
                                background: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                cursor: 'pointer',
                                fontSize: '12px',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                transition: 'all 0.2s',
                                marginLeft: '12px',
                                fontWeight: '500',
                                color: '#495057',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e9ecef';
                                e.currentTarget.style.borderColor = '#adb5bd';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#dee2e6';
                            }}
                            title={isExpanded ? 'Dölj detaljer' : 'Visa detaljer'}
                        >
                            {isExpanded ? 'Minde' : 'Mer'}
                        </button>
                    </div>
                    
                    <RatingStars 
                        placeId={location.id}
                        currentRating={location.rating}
                        totalVotes={location.totalVotes}
                    />
                    
                    {isExpanded && (
                        <div style={{ 
                            marginTop: '12px',
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef'
                        }}>
                            <h4 style={{ 
                                fontSize: '13px', 
                                fontWeight: '600',
                                color: '#495057',
                                margin: '0 0 8px 0'
                            }}>
                                Restaurangdetaljer
                            </h4>
                            
                            <div style={{ fontSize: '12px', lineHeight: '1.4', color: '#6c757d' }}>
                                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>📍</span>
                                    <span>{location.address}</span>
                                </div>
                                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>⭐</span>
                                    <span>{location.rating.toFixed(1)}/5.0 ({location.totalVotes} röster)</span>
                                </div>
                                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>💰</span>
                                    <span>{location.priceRange ? `${location.priceRange} SEK` : 'Pris ej angivet'}</span>
                                </div>
                                <div style={{ marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>🕒</span>
                                    <span>{location.openingHours || 'Öppettider ej angivna'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div style={{ marginTop: '12px' }}>
                        <button
                            onClick={handleShare}
                            style={{
                                width: '100%',
                                backgroundColor: '#28a745',
                                color: 'white',
                                padding: '10px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'background-color 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                        >
                            📤 Dela plats
                        </button>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
});

const generateStructuredData = (location: Location) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': `https://www.kebabkartan.se/${location.slug}`,
        name: location.name,
        image: '/og-image.jpg',
        address: {
            '@type': 'PostalAddress',
            streetAddress: location.address,
            addressLocality: 'Gothenburg',
            addressRegion: 'Västra Götaland County',
            postalCode: '12345',
            addressCountry: 'SE',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude,
        },
        url: `https://kebabkartan.se/${location.slug}`,
        telephone: '',
        priceRange: location.priceRange || '$$',
        servesCuisine: ['Kebab', 'Mellanöstern', 'Turkisk'],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: location.rating,
            reviewCount: location.totalVotes,
            bestRating: '5',
            worstRating: '1'
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
            opens: '11:00',
            closes: '22:00'
        },
        hasMenu: {
            '@type': 'Menu',
            name: 'Kebab Menu',
            url: `https://kebabkartan.se/${location.slug}/menu`
        }
    };
};

const MapControls: React.FC<{
    markers: Location[];
    onLocationSelect: (location: Location) => void;
    initialPlaceSlug: string | null;
}> = ({ markers, onLocationSelect, initialPlaceSlug }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const map = useMap();
    const { isMenuOpen } = useMobileMenu();


    const filteredMarkers = useMemo(() => {
        if (!searchQuery.trim()) return markers;
        const query = searchQuery.toLowerCase();
        return markers.filter(marker => 
            marker.name.toLowerCase().includes(query)
        );
    }, [markers, searchQuery]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }

            if (searchQuery && filteredMarkers.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedResultIndex(prev => 
                        prev < filteredMarkers.length - 1 ? prev + 1 : prev
                    );
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedResultIndex(prev => prev > 0 ? prev - 1 : prev);
                } else if (e.key === 'Enter' && selectedResultIndex >= 0) {
                    e.preventDefault();
                    const selectedPlace = filteredMarkers[selectedResultIndex];
                    handleResultClick(selectedPlace);
                } else if (e.key === 'Escape') {
                    setSearchQuery('');
                    setSelectedResultIndex(-1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchQuery, filteredMarkers, selectedResultIndex]);

    useEffect(() => {
        setSelectedResultIndex(-1);
    }, [searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedResultIndex(-1);
    };

    const handleResultClick = (location: Location) => {
        onLocationSelect(location);
        setSearchQuery('');
        setSelectedResultIndex(-1);
        map.setView([location.latitude, location.longitude], 15, {
            animate: true,
            duration: 0.5
        });
        trackSearchResultSelect(location.id, location.name);
    };

    return (
        <>
            {!isMenuOpen ? (
                <div className="mobile-search" style={{
                    position: 'absolute',
                    top: '20px',
                    left: 'calc(50% + 140px)',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    width: '300px',
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ position: 'relative', display: 'flex' }}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Sök kebabställen... (Ctrl/Cmd + K)"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (e.target.value.length > 0) {
                                    trackSearch(e.target.value);
                                }
                            }}
                            onFocus={() => trackSearchOpen()}
                            style={{
                                width: '100%',
                                padding: '8px',
                                paddingRight: '30px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    {searchQuery && filteredMarkers.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            marginTop: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}>
                            {filteredMarkers.map((location, index) => (
                                <div
                                    key={location.id}
                                    onClick={() => handleResultClick(location)}
                                    style={{
                                        padding: '10px',
                                        cursor: 'pointer',
                                        backgroundColor: index === selectedResultIndex ? '#f0f0f0' : 'transparent',
                                        borderBottom: '1px solid #eee'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold' }}>{location.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{location.address}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </>
    );
};

const CenterMapOnLocation: React.FC<{ location: Location | null }> = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.setView([location.latitude, location.longitude], 15, {
                animate: true,
                duration: 0.5,
            });
        }
    }, [location, map]);
    return null;
};

const MapClickHandler: React.FC<{ onMapClick: () => void }> = ({ onMapClick }) => {
    const map = useMap();
    
    useEffect(() => {
        const handleMapClick = (e: L.LeafletMouseEvent) => {
            // Only reset if clicking on the map itself, not on markers or clusters
            const target = e.originalEvent.target as HTMLElement;
            if (target && (target.classList.contains('leaflet-container') || 
                target.classList.contains('leaflet-tile-pane'))) {
                onMapClick();
            }
        };

        map.on('click', handleMapClick);
        return () => {
            map.off('click', handleMapClick);
        };
    }, [map, onMapClick]);
    
    return null;
};

const useMapCentering = () => {
    const map = useMap();
    
    const centerOnLocation = (location: Location) => {
        map.setView([location.latitude, location.longitude], 15);
    };
    
    return centerOnLocation;
};

const Map: React.FC<MapProps> = ({ initialPlaceSlug = null, initialCenter, initialZoom }) => {
    const [markers, setMarkers] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [initialPlace, setInitialPlace] = useState<Location | null>(null);
    const [isReady, setIsReady] = useState(false);
    
    // Debug function to log location selection
    const handleLocationSelect = (location: Location | null) => {
        setSelectedLocation(location);
        
        // Update document title when location is selected
        if (location) {
            document.title = `${location.name} | Betygsätt och recensera | Kebabkartan`;
        } else {
            // Reset to default title when no location is selected
            document.title = 'Kebabkartan | Hitta och betygsätt din favorit kebab';
        }
    };

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);
    const initialPlaceSlugRef = useRef(initialPlaceSlug);
    
    // Update the ref when initialPlaceSlug prop changes
    useEffect(() => {
        initialPlaceSlugRef.current = initialPlaceSlug;
    }, [initialPlaceSlug]);
    
    const [defaultView, setDefaultView] = useState<Coordinates>(
        initialCenter && initialZoom 
            ? { latitude: initialCenter[0], longitude: initialCenter[1], zoom: initialZoom }
            : SWEDEN_VIEW
    );
    
    // Calculate initial center based on initial place ID
    const getInitialCenter = (): [number, number] => {
        if (initialPlace) {
            return [initialPlace.latitude, initialPlace.longitude];
        }
        if (selectedLocation) {
            return [selectedLocation.latitude, selectedLocation.longitude];
        }
        return [defaultView.latitude, defaultView.longitude];
    };
    
    const getInitialZoom = () => {
        if (initialPlace || selectedLocation) {
            return 15;
        }
        return defaultView.zoom;
    };
    const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

    const createClusterCustomIcon = (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
            html: `
                <div class="cluster-icon" role="img" aria-label="${count} places">
                    <span class="cluster-emoji" aria-hidden="true" style="font-size: 54px !important;">🍕</span>
                </div>
            `,
            className: 'marker-cluster-custom',
            iconSize: [44, 44],
            iconAnchor: [22, 44],
            popupAnchor: [0, -44]
        });
    };

    useEffect(() => {
        // Check if geolocation permission is available
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((result) => {
                    setPermissionState(result.state);
                    trackGeolocationPermission(result.state);
                    result.onchange = () => setPermissionState(result.state);
                });
        }
    }, []);

    // Effect to get initial location from IP
    useEffect(() => {
        const getLocationFromIP = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to get location from IP');
                
                const data = await response.json();
                if (data.latitude && data.longitude) {
                    setDefaultView({
                        latitude: data.latitude,
                        longitude: data.longitude,
                        zoom: 11 // City level zoom
                    });
                    trackIpLocationSuccess(data.latitude, data.longitude);
                }
            } catch (error) {
                console.error('Error getting location from IP:', error);
                // Keep the Sweden view as fallback
                trackIpLocationError(error instanceof Error ? error.message : 'Unknown error');
            }
        };

        if (!selectedLocation) {
            getLocationFromIP();
        }
    }, []);

    // Effect to find initial place before map renders
    useEffect(() => {
        const findInitialPlace = async () => {
            if (!initialPlaceSlug) {
                setIsReady(true);
                return;
            }

            try {
                const response = await fetch('/api/kebab-places');
                const places = await response.json();
            
                // If it's a slug, find by admin-defined slug with restaurang/ prefix
                const targetPlace = places.find((place: Location) => 
                    place.slug === `restaurang/${initialPlaceSlug}`
                );

                if (targetPlace) {
                    setInitialPlace(targetPlace);
                    setSelectedLocation(targetPlace);
                    document.title = `${targetPlace.name} | Betygsätt och recensera | Kebabkartan`;
                }
            } catch (error) {
                console.error('Error fetching initial place:', error);
            } finally {
                setIsReady(true);
            }
        };

        findInitialPlace();
    }, [initialPlaceSlug]);

    // Effect for handling direct navigation and initial load
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/kebab-places');
                const data = await response.json();
                setMarkers(data);
            } catch (error) {
                console.error('Error fetching kebab places:', error);
            } finally {
                setIsInitialLoad(false);
            }
        };

        fetchLocations();
    }, [initialPlace]);

    // Effect for handling client-side navigation
    useEffect(() => {
        const currentPath = window.location.pathname;
        const isMainPage = currentPath === '/';
        
        if (!isInitialLoad && selectedLocation) {
            // Always update URL when a location is selected, regardless of page type
            
            // Use admin-defined slug
            const slug = selectedLocation.slug;
            const newPath = `/${slug}`;

            if (currentPath !== newPath) {
                window.history.pushState({}, '', newPath);
            }
        } else if (!isInitialLoad && !selectedLocation) {
            // Only reset URL when no location is selected, and only on main page
            // Don't reset URL on city pages when no marker is selected
            if (isMainPage) {
                if (currentPath !== '/') {
                    window.history.pushState({}, '', '/');
                }
            }
        }
    }, [selectedLocation, isInitialLoad]);

    // Handle browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/');
            const placeId = pathParts[2]; // /restaurang/[id]
            const isCityPage = currentPath.startsWith('/kebab-');
            
            if (placeId && placeId !== selectedLocation?.id && placeId !== selectedLocation?.slug) {
                // Check if it's a UUID or a slug
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(placeId);
                
                let place = null;
                if (isUUID) {
                    // If it's a UUID, find by ID
                    place = markers.find(marker => marker.id === placeId);
                } else {
                    // If it's a slug, find by admin-defined slug with restaurang/ prefix
                    place = markers.find(marker => 
                        marker.slug === `restaurang/${placeId}`
                    );
                }
                
                if (place) {
                    setSelectedLocation(place);
                    // Update document title for back/forward navigation
                    document.title = `${place.name} | Betygsätt och recensera | Kebabkartan`;
                }
            } else if (!placeId && selectedLocation) {
                // URL doesn't have a place ID, deselect current location
                setSelectedLocation(null);
                // Reset to default title when no location is selected
                document.title = 'Kebabkartan | Hitta och betygsätt din favorit kebab';
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [markers, selectedLocation]);

    // Don't render map until we're ready
    if (!isReady) {
        return (
            <MobileMenuProvider>
                <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
                    <img
                        src={MAP_PLACEHOLDER}
                        alt="Map loading"
                        style={{
                            position: 'absolute',
                            width: 'calc(100% - 280px)',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 1,
                            top: 0,
                            left: '280px'
                        }}
                    />
                </div>
            </MobileMenuProvider>
        );
    }

    return (
        <MobileMenuProvider>
            <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
                {!mapLoaded && (
                    <img
                        src={MAP_PLACEHOLDER}
                        alt="Map loading"
                        style={{
                            position: 'absolute',
                            width: 'calc(100% - 280px)',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 1,
                            top: 0,
                            left: '280px'
                        }}
                    />
                )}
                <MapContainer
                    center={getInitialCenter()}
                    zoom={getInitialZoom()}
                    scrollWheelZoom={true}
                    touchZoom={true}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributor"
                        eventHandlers={{
                            load: () => { setMapLoaded(true); trackMapLoaded(); },
                        }}
                    />
                    <Header permissionState={permissionState} />
                    <MapControls 
                        markers={markers} 
                        onLocationSelect={handleLocationSelect}
                        initialPlaceSlug={initialPlaceSlug}
                    />
                    <CenterMapOnLocation location={selectedLocation} />
                    <MapClickHandler onMapClick={() => handleLocationSelect(null)} />
                    <MarkerClusterGroup
                        chunkedLoading
                        maxClusterRadius={60}
                        spiderfyOnMaxZoom={true}
                        showCoverageOnHover={false}
                        zoomToBoundsOnClick={true}
                        iconCreateFunction={createClusterCustomIcon}
                        disableClusteringAtZoom={15}
                    >
                        {markers
                            .map((location) => {
                                return (
                                    <ZoomableMarker 
                                        key={location.id} 
                                        location={location} 
                                        onClickLocation={handleLocationSelect}
                                        isSelected={selectedLocation?.id === location.id}
                                    />
                                );
                            })}
                    </MarkerClusterGroup>

                    {selectedLocation && (
                        <SetViewOnSelect 
                            lat={selectedLocation.latitude} 
                            lng={selectedLocation.longitude} 
                        />
                    )}
                </MapContainer>

                {selectedLocation && (
                    <script type="application/ld+json">
                        {JSON.stringify(generateStructuredData(selectedLocation))}
                    </script>
                )}
            </div>
        </MobileMenuProvider>
    );
};

export default Map; 