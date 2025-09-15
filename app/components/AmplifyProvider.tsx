'use client';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports.js';
import { AuthProvider } from '../contexts/AuthContext';

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    Amplify.configure(awsExports);
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
