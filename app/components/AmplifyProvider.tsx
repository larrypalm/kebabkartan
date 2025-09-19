'use client';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports.js';
import { AuthProvider } from '@/app/contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    try {
      Amplify.configure(awsExports);
      console.log('Amplify configured successfully');
    } catch (error) {
      console.error('Failed to configure Amplify:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
}
