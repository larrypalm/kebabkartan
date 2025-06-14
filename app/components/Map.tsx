'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { trackKebabPlaceView, trackRatingSubmitted, trackSearch, trackSearchResultSelect } from '@/app/utils/analytics';

interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    totalVotes: number;
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
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleRating = async (rating: number) => {
        if (isSubmitting) return;

        if (!executeRecaptcha) {
            alert("reCAPTCHA is not ready. Please try again in a moment.");
            return;
        }

        setIsSubmitting(true);

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
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update rating');
            }

            // Track the rating submission
            trackRatingSubmitted(placeId, 'Kebab Place', rating);

            window.location.reload();
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Failed to update rating. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rating-container">
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleRating(star)}
                        disabled={isSubmitting}
                        style={{ 
                            background: 'none',
                            border: 'none',
                            cursor: isSubmitting ? 'default' : 'pointer',
                            fontSize: '24px',
                            padding: '0 2px'
                        }}
                    >
                        {star <= (hoveredRating || currentRating) ? '❤️' : '🤍'}
                    </button>
                ))}
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Average rating: {currentRating.toFixed(1)} ({totalVotes} votes)
            </div>
        </div>
    );
};

const LocationButton: React.FC = () => {
    const map = useMap();
    const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

    useEffect(() => {
        // Check if geolocation permission is available
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((result) => {
                    setPermissionState(result.state);
                    result.onchange = () => setPermissionState(result.state);
                });
        }
    }, []);

    const handleClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 13);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // If denied, zoom out to show all of Sweden
                    map.setView([SWEDEN_VIEW.latitude, SWEDEN_VIEW.longitude], SWEDEN_VIEW.zoom);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            console.error('Geolocation is not supported');
            map.setView([SWEDEN_VIEW.latitude, SWEDEN_VIEW.longitude], SWEDEN_VIEW.zoom);
        }
    };

    // Don't show the button if permission is denied
    if (permissionState === 'denied') {
        return null;
    }

    return (
        <button
            className="location-button"
            onClick={handleClick}
        >
            <span style={{ fontSize: '20px' }}>📍</span>
            {permissionState === 'granted' ? 'Show My Location' : 'Use My Location'}
        </button>
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
    
    const handleClick = () => {
        map.setView([location.latitude, location.longitude], 15);
        onClickLocation(location);
    };

    const handlePopupClose = () => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        onClickLocation(null);
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
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url)
                .then(() => alert('Link copied to clipboard!'))
                .catch(console.error);
        }
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
            <Popup>
                <div style={{ minWidth: '200px' }}>
                    <strong>{location.name}</strong>
                    <br />
                    <strong>{location.address}</strong>
                    <br />
                    <RatingStars 
                        placeId={location.id}
                        currentRating={location.rating}
                        totalVotes={location.totalVotes}
                    />
                    <button
                        onClick={handleShare}
                        style={{
                            marginTop: '10px',
                            width: '100%',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Share Location
                    </button>
                </div>
            </Popup>
        </Marker>
    );
});

const generateStructuredData = (location: Location) => {
    return {
        '@context': 'http://schema.org',
        '@type': 'Kebabkartan',
        name: location.name,
        address: {
            '@type': 'PostalAddress',
            streetAddress: location.address,
            addressLocality: 'Gothenburg',
            addressRegion: 'Västra Götaland County',
            postalCode: '12345',
            addressCountry: 'SE',
        },
        ratingValue: location.rating,
        reviewCount: location.totalVotes,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude,
        },
        url: `https://www.kebabkartan.se/place/${location.id}`,
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
            {showAllPlaces ? (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
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
            ) : (
                <button
                    onClick={() => setShowAllPlaces(true)}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
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
                >
                    Show All Places
                </button>
            )}
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


    // Effect to get initial location from IP
    useEffect(() => {
        const getLocationFromIP = async () => {
            try {
                const response = await fetch('https://corsproxy.io/?https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to get location from IP');
                
                const data = await response.json();
                if (data.latitude && data.longitude) {
                    setDefaultView({
                        latitude: data.latitude,
                        longitude: data.longitude,
                        zoom: 11 // City level zoom
                    });
                }
            } catch (error) {
                console.error('Error getting location from IP:', error);
                // Keep the Sweden view as fallback
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

    const handleLocationClick = (location: Location | null) => {
        if (location?.id === selectedLocation?.id) return;
        setSelectedLocation(location);
        if (location) {
            // Removed trackKebabPlaceView to avoid double event
        }
    };

    // Handle browser back/forward
    useEffect(() => {
        const handlePopState = () => {
            const pathParts = window.location.pathname.split('/');
            const placeId = pathParts[2];
            
            if (placeId && markers.length > 0) {
                const place = markers.find(m => m.id === placeId);
                if (place && place.id !== selectedLocation?.id) {
                    setSelectedLocation(place);
                }
            } else {
                setSelectedLocation(null);
                initialPlaceIdRef.current = null;
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [markers, selectedLocation]);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            {!mapLoaded && (
                <img
                    src={MAP_PLACEHOLDER}
                    alt="Map loading"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 1,
                        top: 0,
                        left: 0
                    }}
                />
            )}
            <MapContainer
                center={selectedLocation 
                    ? [selectedLocation.latitude, selectedLocation.longitude]
                    : [defaultView.latitude, defaultView.longitude]}
                zoom={selectedLocation ? 15 : defaultView.zoom}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={true}
                touchZoom={true}
                zoomControl={false}
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    eventHandlers={{
                        load: () => setMapLoaded(true),
                    }}
                />
                <LocationButton />
                <MapControls 
                    markers={markers} 
                    onLocationSelect={setSelectedLocation}
                    initialPlaceId={initialPlaceId}
                    onShowAllPlacesChange={setShowAllPlaces}
                />
                <CenterMapOnLocation location={selectedLocation} />
                {markers
                    .filter(location => showAllPlaces || location.id === selectedLocation?.id)
                    .map((location) => (
                        <ZoomableMarker 
                            key={location.id} 
                            location={location} 
                            onClickLocation={handleLocationClick}
                            isSelected={selectedLocation?.id === location.id}
                        />
                    ))}

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
    );
};

export default Map; 