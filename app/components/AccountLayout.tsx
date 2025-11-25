'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import Map component to prevent SSR issues
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280'
    }}>
      Loading map...
    </div>
  )
});

interface AccountLayoutProps {
  children: React.ReactNode;
  showMap?: boolean;
  isAuthPage?: boolean;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children, showMap = true, isAuthPage = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMapClick = () => {
    if (sidebarOpen) {
      router.push('/');
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state during SSR
  if (!isClient) {
    if (isAuthPage) {
      // For auth page, show a centered modal-like layout
      return (
        <div style={{ 
          position: 'relative', 
          width: '100vw', 
          height: '100vh', 
          display: 'flex',
          backgroundColor: '#f3f4f6',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '400px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  My Account
                </h1>
                <button
                  onClick={() => router.push('/')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              {children}
            </div>
          </div>
        </div>
      );
    } else {
      // For other pages, show sidebar layout
      return (
        <div style={{ 
          position: 'relative', 
          width: '100vw', 
          height: '100vh', 
          display: 'flex',
          backgroundColor: '#f3f4f6'
        }}>
          <div style={{
            position: 'fixed',
            top: 0,
            right: '0',
            width: '400px',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1001,
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  My Account
                </h1>
                <button
                  onClick={() => router.push('/')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              {children}
            </div>
          </div>
          <div style={{
            width: 'calc(100% - 400px)',
            height: '100%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280'
          }}>
            Loading...
          </div>
        </div>
      );
    }
  }

  if (isAuthPage) {
    // For auth page, show centered modal overlay
    return (
      <div style={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        display: 'flex',
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '400px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                My Account
              </h1>
              <button
                onClick={() => router.push('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
      {/* Map Container */}
      {showMap && (
        <div 
          style={{ 
            position: 'relative',
            width: sidebarOpen ? 'calc(100% - 400px)' : '100%',
            height: '100%',
            transition: 'width 0.3s ease-in-out'
          }}
          onClick={handleMapClick}
        >
          <Map initialPlaceSlug={null} />
        </div>
      )}

      {/* Sidebar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: sidebarOpen ? '0' : '-400px',
          width: '400px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          transition: 'right 0.3s ease-in-out',
          overflowY: 'auto'
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              My Account
            </h1>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>

      {/* Toggle Button when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={handleSidebarToggle}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1002,
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          My Account
        </button>
      )}
    </div>
  );
};

export default AccountLayout;
