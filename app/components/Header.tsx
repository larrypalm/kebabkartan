'use client';

import React from 'react';
import { useMap } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthButton from './AuthButton';

interface HeaderProps {
    permissionState: PermissionState | null;
}

const Header: React.FC<HeaderProps> = ({ permissionState }) => {
    const map = useMap();
    const router = useRouter();

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 13);
                },
                () => {
                    map.setView([62.5, 16.5], 5);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            map.setView([62.5, 16.5], 5);
        }
    };

    const handleLogoClick = () => {
        map.setView([62.5, 16.5], 5);
        router.push('/');
    };

    return (
        <header role="banner" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            pointerEvents: 'none'
        }}>
            <div
                className="header-logo"
                onClick={handleLogoClick}
                style={{
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center'
                }}
                tabIndex={0}
                role="button"
                aria-label="Go to home"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
            >
                <Image
                    src="/static/logo.png"
                    alt="Kebabkartan logo"
                    width={80}
                    height={80}
                    priority
                    style={{ display: 'block', height: 'auto', width: 'auto', maxHeight: 124 }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto' }}>
                {permissionState !== 'denied' && (
                    <button
                        className="location-button"
                        onClick={handleLocationClick}
                        aria-label={permissionState === 'granted' ? 'Show my location' : 'Use my location'}
                    >
                        <span aria-hidden="true" style={{ fontSize: '20px' }}>📍</span>
                        {permissionState === 'granted' ? 'Show My Location' : 'Use My Location'}
                    </button>
                )}
                <AuthButton />
            </div>
        </header>
    );
};

export default Header; 