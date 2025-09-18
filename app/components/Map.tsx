'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { trackKebabPlaceView, trackRatingSubmitted, trackSearch, trackSearchResultSelect, trackMarkerClick, trackMarkerShare, trackMarkerExpand, trackMapLoaded, trackShowAllPlaces, trackIpLocationSuccess, trackIpLocationError, trackGeolocationPermission, trackRatingSubmitAttempt, trackRatingSubmitError, trackSearchOpen, trackSearchClear } from '@/app/utils/analytics';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from './Header';
import { MobileMenuProvider, useMobileMenu } from '@/app/contexts/MobileMenuContext';

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
}

interface RatingStarsProps {
    placeId: string;
    currentRating: number;
    totalVotes: number;
}

interface MapProps {
    initialPlaceId?: string | null;
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
            const shouldSignIn = confirm('You need to sign in to vote on kebab places. Would you like to sign in now?');
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
            alert("reCAPTCHA is not ready. Please try again in a moment.");
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
                trackRatingSubmitError(placeId, rating, errorText || 'Failed to update rating');
                throw new Error(errorText || 'Failed to update rating');
            }

            // Track the rating submission
            trackRatingSubmitted(placeId, 'Kebab Place', rating);

            // Update user vote state
            setUserVote(rating);

            window.location.reload();
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Failed to update rating. Please try again.');
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
                            title={!isAuthenticated ? 'Sign in to vote' : (isAlreadyVoted ? 'You already voted this rating' : `Rate ${star} star${star > 1 ? 's' : ''}`)}
                        >
                            {(isActive || star <= (hoveredRating || userVote || currentRating)) ? '❤️' : '🤍'}
                        </button>
                    );
                })}
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Average rating: {currentRating.toFixed(1)} ({totalVotes} votes)
            </div>
            {user && userVote && (
                <div style={{ 
                    fontSize: '10px', 
                    marginTop: '2px', 
                    color: '#e74c3c',
                    fontWeight: 'bold'
                }}>
                    Your rating: {userVote} star{userVote > 1 ? 's' : ''}
                </div>
            )}
            {!user && (
                <div style={{ 
                    fontSize: '10px', 
                    marginTop: '2px', 
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    Sign in to vote
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
    
    const handleClick = () => {
        map.setView([location.latitude, location.longitude], 15);
        onClickLocation(location);
        trackMarkerClick(location.id, location.name);
    };

    const handlePopupClose = () => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        onClickLocation(null);
        setIsExpanded(false); // Reset expansion state when popup closes
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

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `${window.location.origin}/place/${location.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: `Kebabkartan - ${location.name}`,
                text: `Check out ${location.name} on Kebabkartan!`,
                url: url,
            }).then(() => trackMarkerShare(location.id, location.name, 'webshare'))
              .catch(console.error);
        } else {
            navigator.clipboard.writeText(url)
                .then(() => { 
                    alert('Link copied to clipboard!');
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
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                            {isExpanded ? 'Less' : 'More'}
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
                                Restaurant Details
                            </h4>
                            
                            <div style={{ fontSize: '12px', lineHeight: '1.4', color: '#6c757d' }}>
                                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>📍</span>
                                    <span>{location.address}</span>
                                </div>
                                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>⭐</span>
                                    <span>{location.rating.toFixed(1)}/5.0 ({location.totalVotes} votes)</span>
                                </div>
                                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>💰</span>
                                    <span>{location.priceRange ? `${location.priceRange} SEK` : 'Price not specified'}</span>
                                </div>
                                <div style={{ marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '6px' }}>🕒</span>
                                    <span>{location.openingHours || 'Hours not specified'}</span>
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
                            📤 Share Location
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
        '@id': `https://www.kebabkartan.se/place/${location.id}`,
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
        url: `https://kebabkartan.se/place/${location.id}`,
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
            url: `https://kebabkartan.se/place/${location.id}/menu`
        }
    };
};

const MapControls: React.FC<{
    markers: Location[];
    onLocationSelect: (location: Location) => void;
    initialPlaceId: string | null;
    onShowAllPlacesChange: (show: boolean) => void;
}> = ({ markers, onLocationSelect, initialPlaceId, onShowAllPlacesChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const [showAllPlaces, setShowAllPlaces] = useState(!initialPlaceId);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const map = useMap();
    const { isMenuOpen } = useMobileMenu();

    useEffect(() => {
        onShowAllPlacesChange(showAllPlaces);
    }, [showAllPlaces, onShowAllPlacesChange]);

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
            {showAllPlaces && !isMenuOpen ? (
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
                    <div style={{ position: 'relative' }}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search kebab places... (Ctrl/Cmd + K)"
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
            ) : !isMenuOpen ? (
                <button
                    className="mobile-search"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: 'calc(50% + 140px)',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                    onClick={() => { setShowAllPlaces(true); trackShowAllPlaces(); }}
                >
                    Show All Places
                </button>
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

const useMapCentering = () => {
    const map = useMap();
    
    const centerOnLocation = (location: Location) => {
        map.setView([location.latitude, location.longitude], 15);
    };
    
    return centerOnLocation;
};

const Map: React.FC<MapProps> = ({ initialPlaceId = null }) => {
    const [markers, setMarkers] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);
    const initialPlaceIdRef = useRef(initialPlaceId);
    const [defaultView, setDefaultView] = useState<Coordinates>(SWEDEN_VIEW);
    const [showAllPlaces, setShowAllPlaces] = useState(!initialPlaceId);
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

    // Effect for handling direct navigation and initial load
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/kebab-places');
                const data = await response.json();
                setMarkers(data);
                
                // Handle initial place ID from URL or prop
                const urlPlaceId = window.location.pathname.split('/')[2];
                const targetPlaceId = urlPlaceId || initialPlaceIdRef.current;
                
                if (targetPlaceId) {
                    const targetPlace = data.find((place: Location) => place.id === targetPlaceId);
                    if (targetPlace) {
                        setSelectedLocation(targetPlace);
                    }
                }
            } catch (error) {
                console.error('Error fetching kebab places:', error);
            } finally {
                setIsInitialLoad(false);
            }
        };

        fetchLocations();
    }, []);

    // Effect for handling client-side navigation
    useEffect(() => {
        if (!isInitialLoad && selectedLocation) {
            const newPath = `/place/${selectedLocation.id}`;
            if (window.location.pathname !== newPath) {
                window.history.pushState({}, '', newPath);
            }
        }
    }, [selectedLocation, isInitialLoad]);

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
                    center={selectedLocation 
                        ? [selectedLocation.latitude, selectedLocation.longitude]
                        : [defaultView.latitude, defaultView.longitude]}
                    zoom={selectedLocation ? 15 : defaultView.zoom}
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
                        onLocationSelect={setSelectedLocation}
                        initialPlaceId={initialPlaceId}
                        onShowAllPlacesChange={setShowAllPlaces}
                    />
                    <CenterMapOnLocation location={selectedLocation} />
                    <MarkerClusterGroup
                        chunkedLoading
                        showCoverageOnHover={false}
                        spiderfyOnMaxZoom
                        iconCreateFunction={createClusterCustomIcon}
                    >
                        {markers
                            .filter(location => showAllPlaces || location.id === selectedLocation?.id)
                            .map((location) => (
                                <ZoomableMarker 
                                    key={location.id} 
                                    location={location} 
                                    onClickLocation={setSelectedLocation}
                                    isSelected={selectedLocation?.id === location.id}
                                />
                            ))}
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