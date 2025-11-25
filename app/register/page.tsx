'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from 'aws-amplify/auth';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';
import { MaterialIcon } from '@/app/components/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return 'Lösenordet måste vara minst 8 tecken långt';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Lösenordet måste innehålla minst en stor bokstav';
    }
    if (!/[a-z]/.test(pass)) {
      return 'Lösenordet måste innehålla minst en liten bokstav';
    }
    if (!/[0-9]/.test(pass)) {
      return 'Lösenordet måste innehålla minst en siffra';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            preferred_username: username,
          },
        },
      });

      setShowSuccess(true);

      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);

      if (err.name === 'UsernameExistsException') {
        setError('Ett konto med denna e-postadress finns redan.');
      } else if (err.name === 'InvalidPasswordException') {
        setError('Lösenordet uppfyller inte kraven.');
      } else if (err.name === 'InvalidParameterException') {
        setError('Ogiltig e-postadress eller användarnamn.');
      } else {
        setError('Ett fel uppstod vid registrering. Försök igen.');
      }
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MaterialIcon name="check_circle" className="text-success text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Kontot har skapats!
            </h2>
            <p className="text-slate-600">
              Vi har skickat en bekräftelselänk till <strong>{email}</strong>
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Omdirigerar till bekräftelsesidan...
          </p>
        </Card>
      </div>
    );
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
                Skapa ditt konto
              </h1>
              <p className="text-slate-600">
                Börja betygsätta och recensera kebab idag
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <MaterialIcon name="error" className="text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                label="Användarnamn"
                placeholder="dittnamn"
                icon="person"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                helperText="Detta visas när du skriver recensioner"
              />

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
                helperText="Minst 8 tecken, en stor bokstav, en liten bokstav och en siffra"
              />

              <Input
                type="password"
                label="Bekräfta lösenord"
                placeholder="••••••••"
                icon="lock"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <div className="text-sm text-slate-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary"
                    required
                  />
                  <span>
                    Jag godkänner{' '}
                    <Link href="/terms" className="text-primary hover:text-orange-700 font-medium">
                      användarvillkoren
                    </Link>
                    {' '}och{' '}
                    <Link href="/privacy" className="text-primary hover:text-orange-700 font-medium">
                      integritetspolicyn
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={isLoading ? undefined : 'person_add'}
              >
                Skapa konto
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                Har du redan ett konto?
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon="login"
                >
                  Logga in
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
