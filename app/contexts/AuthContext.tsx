'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface User {
  username: string;
  signInDetails?: {
    loginId?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check localStorage first for instant loading
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('kebabkartan_user');
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('AuthContext: User fetched:', currentUser);
      setUser(currentUser);
      // Cache user in localStorage
      localStorage.setItem('kebabkartan_user', JSON.stringify(currentUser));
    } catch (err) {
      // Only log if it's not an expected unauthenticated error
      if (err instanceof Error && err.name !== 'UserUnAuthenticatedException') {
        console.log('AuthContext: Authentication error:', err);
      } else {
        console.log('AuthContext: No authenticated user found');
      }
      setUser(null);
      localStorage.removeItem('kebabkartan_user');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      localStorage.removeItem('kebabkartan_user');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    // Immediate fetch, no delay
    fetchUser();

    // Listen for auth events
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log('AuthContext: Hub event received:', payload.event);
      switch (payload.event) {
        case 'signedIn':
          console.log('AuthContext: User signed in, fetching user...');
          fetchUser();
          break;
        case 'signedOut':
          console.log('AuthContext: User signed out');
          setUser(null);
          localStorage.removeItem('kebabkartan_user');
          setLoading(false);
          break;
        case 'tokenRefresh':
          console.log('AuthContext: Token refreshed, fetching user...');
          fetchUser();
          break;
        case 'tokenRefresh_failure':
          console.log('AuthContext: Token refresh failed');
          setUser(null);
          localStorage.removeItem('kebabkartan_user');
          setLoading(false);
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: handleSignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
