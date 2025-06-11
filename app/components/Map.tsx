'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

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
            style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
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

const Map: React.FC<MapProps> = ({ initialPlaceId = null }) => {
    const [markers, setMarkers] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const initialPlaceIdRef = useRef(initialPlaceId);
    const [defaultView, setDefaultView] = useState<Coordinates>(SWEDEN_VIEW);

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
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [markers, selectedLocation]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
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
                />
                <LocationButton />
            
                {markers.map((location) => (
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