'use client';

import { signIn, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AccountLayout from '@/app/components/AccountLayout';
import { useAuth } from '@/app/contexts/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push('/my-account');
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await signIn({
        username: formData.email,
        password: formData.password
      });
      setMessage({ type: 'success', text: 'Successfully signed in!' });
      router.push('/my-account');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to sign in' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      await signUp({
        username: formData.email,
        password: formData.password
      });
      setIsConfirming(true);
      setMessage({ type: 'success', text: 'Account created! Please check your email for confirmation code.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create account' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await confirmSignUp({
        username: formData.email,
        confirmationCode: formData.confirmationCode
      });
      setMessage({ type: 'success', text: 'Account confirmed! You can now sign in.' });
      setIsConfirming(false);
      setIsSignUp(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to confirm account' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: formData.email });
      setMessage({ type: 'success', text: 'Confirmation code resent to your email.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to resend code' });
    }
  };

  if (loading) {
    return (
      <AccountLayout>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#6b7280' }}>Loading...</div>
        </div>
      </AccountLayout>
    );
  }

  if (user) {
    return (
      <AccountLayout>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Welcome, {user.username}!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You are already signed in.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => router.push('/my-account')}
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Go to My Account
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div style={{ maxWidth: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
          {isConfirming ? 'Confirm Your Account' : isSignUp ? 'Create Account' : 'Sign In to Your Account'}
        </h1>

        {/* Message Display */}
        {message.text && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '6px',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#dc2626',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
          }}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => {
              setIsSignUp(false);
              setIsConfirming(false);
              setMessage({ type: '', text: '' });
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: !isSignUp && !isConfirming ? '#dbeafe' : 'transparent',
              color: !isSignUp && !isConfirming ? '#2563eb' : '#6b7280',
              border: 'none',
              borderBottom: !isSignUp && !isConfirming ? '2px solid #2563eb' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignUp(true);
              setIsConfirming(false);
              setMessage({ type: '', text: '' });
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: isSignUp && !isConfirming ? '#dbeafe' : 'transparent',
              color: isSignUp && !isConfirming ? '#2563eb' : '#6b7280',
              border: 'none',
              borderBottom: isSignUp && !isConfirming ? '2px solid #2563eb' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {!isSignUp && !isConfirming && (
          <form onSubmit={handleSignIn}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter your Email"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter your Password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {isSignUp && !isConfirming && (
          <form onSubmit={handleSignUp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter your Email"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter your Password"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Confirm your Password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        {/* Confirmation Form */}
        {isConfirming && (
          <form onSubmit={handleConfirmSignUp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Confirmation Code
                </label>
                <input
                  type="text"
                  name="confirmationCode"
                  value={formData.confirmationCode}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter confirmation code from email"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Confirming...' : 'Confirm Account'}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #3b82f6',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Link */}
        {!isSignUp && !isConfirming && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
