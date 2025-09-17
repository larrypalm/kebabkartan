'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('AuthButton: user:', user, 'loading:', loading);

  if (loading) {
    return (
      <button className="auth-button loading" disabled>
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <button 
        onClick={() => router.push('/my-account')} 
        className="auth-button my-account"
      >
        My Account
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => router.push('/auth')} 
        className="auth-button sign-in"
      >
        Sign In
      </button>
      
      <style jsx>{`
        .auth-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
        }

        .auth-button:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
        }

        .auth-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .auth-button.loading {
          background: #6c757d;
          cursor: not-allowed;
        }

        .auth-button.my-account {
          background: #28a745;
          box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
        }

        .auth-button.my-account:hover {
          background: #218838;
          box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
        }
      `}</style>
    </>
  );
}
