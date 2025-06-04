'use client'; // Ensures this is a client-side component

import React, { useState, useMemo, useEffect } from 'react'; // Ensure React is explicitly imported
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RatingStars = ({ placeId, currentRating, totalVotes }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRating = async (rating) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placeId,
                    rating,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update rating');
            }

            // Refresh the page to get updated ratings
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

const LocationButton = () => {
    const map = useMap();

    const handleClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 13); // Set zoom level to 13
                },
                () => {
                    alert('Geolocation not available or permission denied.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

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
            }}
            onClick={handleClick}
        >
            Go to My Location
        </button>
    );
};

const ZoomableMarker = React.memo(({ location, onClickLocation }) => {
    const map = useMap();
    
    const handleClick = () => {
        map.setView([location.latitude, location.longitude], 15);
        onClickLocation(location); // Pass the location to the parent component
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
        <Marker position={[location.latitude, location.longitude]} icon={pizzaIcon} eventHandlers={{ click: handleClick }}>
            <Popup>
                <div style={{ minWidth: '200px' }}>
                    <strong>{location.name}</strong>
                    <br />
                    <RatingStars 
                        placeId={location.id}
                        currentRating={location.rating}
                        totalVotes={location.totalVotes}
                    />
                </div>
            </Popup>
        </Marker>
    );
});

const Map = () => {
    const [markers, setMarkers] = useState();
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        // Simulate fetching data from an API (for now using dummy data)
        const fetchLocations = () => {
            const handleFetch = async () => {
                const response = await fetch('/api/kebab-places');
                const data = await response.json();
                setMarkers(data);
            };
            handleFetch();
        };

        fetchLocations();
    }, []);

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
    };

    // Function to generate JSON-LD for structured data
    const generateStructuredData = (location) => {
        return {
            '@context': 'http://schema.org',
            '@type': 'PizzaRestaurantTest',
            name: location.name,
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Example St 123',
                addressLocality: 'Gothenburg',
                addressRegion: 'Västra Götaland County',
                postalCode: '12345',
                addressCountry: 'SE',
            },
            ratingValue: location.rating,
            reviewCount: '150',
            geo: {
                '@type': 'GeoCoordinates',
                latitude: location.lat,
                longitude: location.lon,
            },
            url: `https://yourwebsite.com/pizza/${location.id}`,
        };
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <MapContainer
                center={[57.7089, 11.9746]} // Coordinates for Gothenburg
                zoom={13} // Adjusted zoom to focus on Gothenburg
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
            
                {(markers || []).map((location) => (
                    <ZoomableMarker key={location.id} location={location} onClickLocation={handleLocationClick} />
                ))}
            </MapContainer>

            {selectedLocation && (
                <script type="application/ld+json">{JSON.stringify(generateStructuredData(selectedLocation))}</script>
            )}
        </div>
    );
};

export default Map;