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
      console.log('AuthContext: No user found:', err);
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
    // Initial fetch with delay
    setTimeout(() => {
      fetchUser();
    }, 500);

    // Set up a periodic check for authentication state
    const checkInterval = setInterval(() => {
      console.log('AuthContext: Periodic auth check...');
      fetchUser();
    }, 1000);

    // Clear interval after 30 seconds
    const clearCheck = setTimeout(() => {
      clearInterval(checkInterval);
    }, 30000);

    // Listen for auth events
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log('AuthContext: Hub event received:', payload.event);
      switch (payload.event) {
        case 'signedIn':
          console.log('AuthContext: User signed in, fetching user...');
          clearInterval(checkInterval);
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
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      clearInterval(checkInterval);
      clearTimeout(clearCheck);
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
