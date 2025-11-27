'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'aws-amplify/auth';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';
import { MaterialIcon } from '@/app/components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to profile if already logged in
  useEffect(() => {
    console.log('Login page: loading=', loading, 'user=', user);
    if (!loading && user) {
      console.log('Login page: User already authenticated, redirecting to profile...');
      router.push('/profil');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn({
        username: email,
        password: password,
      });

      // Redirect to profile page after successful login
      router.push('/profil');
    } catch (err: any) {
      console.error('Login error:', err);

      // Handle case where user is already authenticated
      if (err.name === 'UserAlreadyAuthenticatedException') {
        console.log('User already authenticated, redirecting to profile...');
        router.push('/profil');
        return;
      }

      if (err.name === 'UserNotConfirmedException') {
        setError('E-postadressen är inte bekräftad. Kontrollera din e-post.');
      } else if (err.name === 'NotAuthorizedException') {
        setError('Felaktig e-postadress eller lösenord.');
      } else if (err.name === 'UserNotFoundException') {
        setError('Ingen användare hittades med denna e-postadress.');
      } else {
        setError('Ett fel uppstod vid inloggning. Försök igen.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Kontrollerar inloggning...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      {/* Header with Logo */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <MaterialIcon name="restaurant" className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              kebabkartan.se
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card padding="lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Välkommen tillbaka
              </h1>
              <p className="text-slate-600">
                Logga in för att betygsätta och recensera kebab
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <MaterialIcon name="error" className="text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="E-postadress"
                placeholder="din@email.com"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <Input
                type="password"
                label="Lösenord"
                placeholder="••••••••"
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-600">Kom ihåg mig</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-orange-700 font-medium"
                >
                  Glömt lösenord?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={isLoading ? undefined : 'login'}
              >
                Logga in
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">eller</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                Har du inget konto än?
              </p>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon="person_add"
                >
                  Skapa konto
                </Button>
              </Link>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <MaterialIcon name="arrow_back" size="sm" />
              <span>Tillbaka till kartan</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
