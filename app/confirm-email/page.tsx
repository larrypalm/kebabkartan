'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';
import { MaterialIcon } from '@/app/components/Icons';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      setSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login?confirmed=true');
      }, 2000);
    } catch (err: any) {
      console.error('Confirmation error:', err);

      if (err.name === 'CodeMismatchException') {
        setError('Felaktig bekräftelsekod. Kontrollera koden och försök igen.');
      } else if (err.name === 'ExpiredCodeException') {
        setError('Bekräftelsekoden har gått ut. Klicka på "Skicka ny kod" för att få en ny.');
      } else if (err.name === 'LimitExceededException') {
        setError('För många försök. Vänta en stund och försök igen.');
      } else {
        setError('Ett fel uppstod vid bekräftelse. Försök igen.');
      }
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setResendSuccess(false);
    setIsResending(true);

    try {
      await resendSignUpCode({
        username: email,
      });

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      console.error('Resend error:', err);
      setError('Kunde inte skicka ny kod. Försök igen senare.');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MaterialIcon name="check_circle" className="text-success text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              E-post bekräftad!
            </h2>
            <p className="text-slate-600">
              Ditt konto har aktiverats. Du kan nu logga in.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Omdirigerar till inloggningssidan...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      {/* Header with Logo */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-6 flex justify-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/static/logo.png"
              alt="Kebabkartan Logo"
              className="h-16 w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card padding="lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MaterialIcon name="mail" className="text-primary text-4xl" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Bekräfta din e-post
              </h1>
              <p className="text-slate-600">
                Vi har skickat en bekräftelsekod till
              </p>
              <p className="text-slate-900 font-medium mt-1">
                {email}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <MaterialIcon name="error" className="text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {resendSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <MaterialIcon name="check_circle" className="text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm text-success">
                  En ny bekräftelsekod har skickats till din e-post.
                </p>
              </div>
            )}

            {/* Confirmation Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                label="Bekräftelsekod"
                placeholder="123456"
                icon="key"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={isLoading}
                helperText="Ange 6-siffrig kod från e-posten"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={isLoading ? undefined : 'verified'}
              >
                Bekräfta e-post
              </Button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm mb-3">
                Fick du ingen kod?
              </p>
              <Button
                variant="ghost"
                size="md"
                onClick={handleResendCode}
                isLoading={isResending}
                icon="refresh"
              >
                Skicka ny kod
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-slate-600">
                Har du redan bekräftat?{' '}
                <Link href="/login" className="text-primary hover:text-orange-700 font-medium">
                  Logga in
                </Link>
              </p>
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
