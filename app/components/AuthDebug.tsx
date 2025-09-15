'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useAuth } from '../contexts/AuthContext';

export default function AuthDebug() {
  const { user, loading, refreshUser } = useAuth();
  const [directUser, setDirectUser] = useState<any>(null);
  const [directLoading, setDirectLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log('AuthDebug: Direct user check:', currentUser);
        setDirectUser(currentUser);
      } catch (err) {
        console.log('AuthDebug: Direct user check failed:', err);
        setDirectUser(null);
      } finally {
        setDirectLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      zIndex: 10000,
      maxWidth: '400px',
      fontSize: '12px'
    }}>
      <h3>Auth Debug Info</h3>
      <div>
        <strong>Context User:</strong> {user ? 'Found' : 'Not found'}
      </div>
      <div>
        <strong>Context Loading:</strong> {loading ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Direct User:</strong> {directUser ? 'Found' : 'Not found'}
      </div>
      <div>
        <strong>Direct Loading:</strong> {directLoading ? 'Yes' : 'No'}
      </div>
      {user && (
        <div>
          <strong>Username:</strong> {user.username}
        </div>
      )}
      {directUser && (
        <div>
          <strong>Direct Username:</strong> {directUser.username}
        </div>
      )}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={refreshUser}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Refresh Auth
        </button>
      </div>
    </div>
  );
}
