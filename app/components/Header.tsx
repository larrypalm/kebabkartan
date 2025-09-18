'use client';

import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthButton from './AuthButton';
import { useAuth } from '@/app/contexts/AuthContext';
import { useMobileMenu } from '@/app/contexts/MobileMenuContext';

interface HeaderProps {
    permissionState: PermissionState | null;
}

const Header: React.FC<HeaderProps> = ({ permissionState }) => {
    const map = useMap();
    const router = useRouter();
    const { user } = useAuth();
    const { isMenuOpen, setIsMenuOpen } = useMobileMenu();
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        if (isMobile) {
            setSidebarOpen(false);
            setIsMenuOpen(false);
        }
    };

    const handleLogoClick = () => {
        map.setView([62.5, 16.5], 5);
        router.push('/');
        if (isMobile) {
            setSidebarOpen(false);
            setIsMenuOpen(false);
        }
    };

    const handleSuggestionsClick = () => {
        if (user) {
            router.push('/suggestions');
        } else {
            router.push('/auth');
        }
        if (isMobile) {
            setSidebarOpen(false);
            setIsMenuOpen(false);
        }
    };

    const toggleSidebar = () => {
        const newState = !sidebarOpen;
        setSidebarOpen(newState);
        setIsMenuOpen(newState);
    };

    return (
        <>
            {/* Mobile menu button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 2001,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        fontSize: '20px'
                    }}
                    aria-label="Växla meny"
                >
                    ☰
                </button>
            )}
            
            <aside 
                role="complementary" 
                className={isMobile && sidebarOpen ? 'open' : ''}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    // width: isMobile ? '100vw' : '280px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRight: isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                    ...(isMobile && {
                        left: sidebarOpen ? '0' : '-100vw',
                        transition: 'left 0.3s ease'
                    })
                }}
            >
            <div
                className="sidebar-logo"
                onClick={handleLogoClick}
                style={{
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}
                tabIndex={0}
                role="button"
                    aria-label="Gå till hem"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
            >
                <Image
                    src="/static/logo.png"
                    alt="Kebabkartan logo"
                    width={120}
                    height={120}
                    priority
                    style={{ display: 'block', height: 'auto', width: 'auto', maxHeight: 120 }}
                />
            </div>
            
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1.5rem', 
                pointerEvents: 'auto',
                width: '100%'
            }}>
                {permissionState !== 'denied' && (
                    <button
                        className="location-button"
                        onClick={handleLocationClick}
                        aria-label={permissionState === 'granted' ? 'Visa min plats' : 'Använd min plats'}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    >
                        <span aria-hidden="true" style={{ fontSize: '18px' }}>📍</span>
                        {permissionState === 'granted' ? 'Visa min plats' : 'Använd min plats'}
                    </button>
                )}
                <button
                    onClick={handleSuggestionsClick}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s',
                        marginBottom: '12px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                >
                    <span aria-hidden="true" style={{ fontSize: '16px' }}>💡</span>
                    Föreslå restaurang
                </button>
                
                {/* Location quick links */}
                <div style={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px',
                    marginBottom: '12px'
                }}>
                    <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#6b7280', 
                        textAlign: 'center',
                        marginBottom: '4px'
                    }}>
                        Populära städer
                    </div>
                    <button
                        onClick={() => {
                            router.push('/kebab-stockholm');
                            if (isMobile) {
                                setSidebarOpen(false);
                                setIsMenuOpen(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                    >
                        Stockholm
                    </button>
                    <button
                        onClick={() => {
                            router.push('/kebab-goteborg');
                            if (isMobile) {
                                setSidebarOpen(false);
                                setIsMenuOpen(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                    >
                        Göteborg
                    </button>
                    <button
                        onClick={() => {
                            router.push('/kebab-malmo');
                            if (isMobile) {
                                setSidebarOpen(false);
                                setIsMenuOpen(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                    >
                        Malmö
                    </button>
                    <button
                        onClick={() => {
                            router.push('/kebab-jonkoping');
                            if (isMobile) {
                                setSidebarOpen(false);
                                setIsMenuOpen(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                    >
                        Jönköping
                    </button>
                    <button
                        onClick={() => {
                            router.push('/kebab-linkoping');
                            if (isMobile) {
                                setSidebarOpen(false);
                                setIsMenuOpen(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                    >
                        Linköping
                    </button>
                    <button
                        onClick={() => {
                            router.push('/kebab-lund');
                            if (isMobile) {
                                setSidebarOpen(false);
                                setIsMenuOpen(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                    >
                        Lund
                    </button>
                </div>
                
                <AuthButton />
            </div>
            </aside>
        </>
    );
};

export default Header; 