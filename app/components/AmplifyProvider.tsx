'use client';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports.js';
import { AuthProvider } from '@/app/contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';

// Helper to check if auth debugging is enabled
const isDebugAuthEnabled = () => {
  return process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true';
};

// Configure Amplify immediately (outside component to run only once)
try {
  Amplify.configure(awsExports);
  if (isDebugAuthEnabled()) {
    console.log('Amplify configured successfully');
  }
} catch (error) {
  if (isDebugAuthEnabled()) {
    console.error('Failed to configure Amplify:', error);
  }
}

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
}
