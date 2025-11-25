'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import SEOContentOverlay from './SEOContentOverlay';
import Header from '@/app/components/layout/Header';
import BottomNavigation from '@/app/components/layout/BottomNavigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-background-light">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-slate-700 font-medium">Kartan laddar...</p>
      </div>
    </div>
  )
});

export interface CityPageLayoutProps {
  cityName: string;
  description: string;
  initialCenter: [number, number];
  initialZoom: number;
  className?: string;
  style?: React.CSSProperties;
}

const CityPageLayout: React.FC<CityPageLayoutProps> = ({
  cityName,
  description,
  initialCenter,
  initialZoom,
  className = '',
  style
}) => {
  const { user } = useAuth();

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    ...style
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      {/* Header Navigation */}
      <Header
        isLoggedIn={!!user}
        userName={user?.username}
        onSearch={(query) => {
          console.log('Search:', query);
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

      <main role="main" className="relative">
        <div style={containerStyle} className={className}>
          <SEOContentOverlay
            cityName={cityName}
            description={description}
          />

          <Map
            initialPlaceSlug={null}
            initialCenter={initialCenter}
            initialZoom={initialZoom}
          />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </GoogleReCaptchaProvider>
  );
};

export default CityPageLayout;
