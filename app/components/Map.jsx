'use client'; // Ensures this is a client-side component

import React, { useState, useMemo, useEffect } from 'react'; // Ensure React is explicitly imported
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dummy data for locations and ratings in Gothenburg
const locations = [
    { id: 1, lat: 57.7089, lon: 11.9746, rating: 4.5, name: 'Gothenburg City Center' },
    { id: 2, lat: 57.7087, lon: 11.9749, rating: 4.2, name: 'Universeum' },
    { id: 3, lat: 57.7077, lon: 11.9754, rating: 4.6, name: 'Liseberg Amusement Park' },
    { id: 4, lat: 57.7072, lon: 11.9730, rating: 4.7, name: 'Gothenburg Opera' },
    { id: 5, lat: 57.6925, lon: 11.9860, rating: 4.3, name: 'Slottsskogen Park' },
];

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
        map.setView([location.lat, location.lon], 15);
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
        <Marker position={[location.lat, location.lon]} icon={pizzaIcon} eventHandlers={{ click: handleClick }}>
            <Popup>
                <strong>{location.name}</strong>
                <br />
                Rating: {location.rating}
            </Popup>
        </Marker>
    );
});

const Map = () => {
    const [markers, setMarkers] = useState(locations);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        // Simulate fetching data from an API (for now using dummy data)
        const fetchLocations = () => {
            setMarkers(locations);
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
            '@type': 'PizzaRestaurant',
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

                {markers.map((location) => (
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