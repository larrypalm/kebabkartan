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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // Add a small delay to ensure Amplify is fully configured
      await new Promise(resolve => setTimeout(resolve, 100));
      const currentUser = await getCurrentUser();
      console.log('AuthContext: User fetched:', currentUser);
      setUser(currentUser);
    } catch (err) {
      // Only log if it's not an expected unauthenticated error
      if (err instanceof Error && err.name !== 'UserUnAuthenticatedException') {
        console.log('AuthContext: Authentication error:', err);
      } else {
        console.log('AuthContext: No authenticated user found');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    // Initial fetch with delay to ensure Amplify is fully configured
    const timeoutId = setTimeout(() => {
      fetchUser();
    }, 1000);

    // Removed periodic check to prevent excessive re-renders
    // The Hub listener should handle most authentication state changes

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
          setLoading(false);
          break;
        case 'tokenRefresh':
          console.log('AuthContext: Token refreshed, fetching user...');
          fetchUser();
          break;
        case 'tokenRefresh_failure':
          console.log('AuthContext: Token refresh failed');
          setUser(null);
          setLoading(false);
          break;
      }
    });

    // Also check for user on window focus (in case of tab switching)
    const handleFocus = () => {
      console.log('AuthContext: Window focused, checking user...');
      fetchUser();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      // Removed interval cleanup since we removed the periodic check
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
