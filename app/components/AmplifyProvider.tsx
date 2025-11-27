'use client';

import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports.js';
import { AuthProvider } from '@/app/contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';

// Configure Amplify immediately (outside component to run only once)
try {
  Amplify.configure(awsExports);
  console.log('Amplify configured successfully');
} catch (error) {
  console.error('Failed to configure Amplify:', error);
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
