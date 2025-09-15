'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h1>
          <Authenticator
            hideSignUp={false}
            variation="modal"
          >
            {({ signOut, user }) => (
              <div>
                <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username}!</h2>
                <p className="text-gray-600 mb-6">
                  You are now signed in. You can manage your account settings.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/my-account')}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Go to My Account
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}
          </Authenticator>
        </div>
      </div>
    </div>
  );
}
