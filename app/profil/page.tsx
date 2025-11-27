'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from 'aws-amplify/auth';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { MaterialIcon } from '@/app/components/Icons';
import Header from '@/app/components/layout/Header';
import BottomNavigation from '@/app/components/layout/BottomNavigation';

export default function ProfilPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Laddar profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data - will be replaced with actual user data from DynamoDB
  const userProfile = {
    username: user.username || 'Användare',
    displayName: user.username || 'Användare',
    email: user.username || '',
    bio: '',
    avatar: '',
    reviewCount: 0,
    saucePoints: 0,
    followers: [],
    following: [],
    memberSince: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-4xl">
        {/* Profile Header Card */}
        <Card padding="lg" className="mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {userProfile.displayName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {userProfile.displayName}
              </h1>
              <p className="text-slate-600 mb-4">@{userProfile.username}</p>

              {userProfile.bio && (
                <p className="text-slate-700 mb-4">{userProfile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {userProfile.reviewCount}
                  </div>
                  <div className="text-sm text-slate-600">Recensioner</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {userProfile.saucePoints}
                  </div>
                  <div className="text-sm text-slate-600">Såspoäng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {userProfile.following.length}
                  </div>
                  <div className="text-sm text-slate-600">Följer</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {userProfile.followers.length}
                  </div>
                  <div className="text-sm text-slate-600">Följare</div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex-shrink-0">
              <Link href="/profil/redigera">
                <Button variant="outline" icon="edit">
                  Redigera profil
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/profil/recensioner">
            <Card padding="md" className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MaterialIcon name="rate_review" className="text-primary" size="lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Mina recensioner</h3>
                  <p className="text-sm text-slate-600">
                    {userProfile.reviewCount} recensioner
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/profil/sparade">
            <Card padding="md" className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <MaterialIcon name="bookmark" className="text-orange-500" size="lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Sparade platser</h3>
                  <p className="text-sm text-slate-600">Dina favoriter</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/profil/foljare">
            <Card padding="md" className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <MaterialIcon name="people" className="text-blue-500" size="lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Följare & Följer</h3>
                  <p className="text-sm text-slate-600">
                    {userProfile.followers.length} följare, {userProfile.following.length} följer
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/suggestions">
            <Card padding="md" className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <MaterialIcon name="add_location" className="text-green-500" size="lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Föreslå restaurang</h3>
                  <p className="text-sm text-slate-600">Hjälp oss växa</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Settings Section */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MaterialIcon name="settings" />
            Inställningar
          </h2>

          <div className="space-y-3">
            <Link href="/profil/installningar">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon name="person" className="text-slate-600" />
                  <span className="text-slate-900">Kontoinställningar</span>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-400" />
              </div>
            </Link>

            <Link href="/profil/notifieringar">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon name="notifications" className="text-slate-600" />
                  <span className="text-slate-900">Notifieringar</span>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-400" />
              </div>
            </Link>

            <Link href="/profil/integritet">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon name="lock" className="text-slate-600" />
                  <span className="text-slate-900">Integritet</span>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-400" />
              </div>
            </Link>
          </div>
        </Card>

        {/* Support Section */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MaterialIcon name="help" />
            Hjälp & Support
          </h2>

          <div className="space-y-3">
            <Link href="/faq">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon name="question_answer" className="text-slate-600" />
                  <span className="text-slate-900">Vanliga frågor (FAQ)</span>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-400" />
              </div>
            </Link>

            <a href="mailto:support@kebabkartan.se">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon name="mail" className="text-slate-600" />
                  <span className="text-slate-900">Kontakta oss</span>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-400" />
              </div>
            </a>

            <Link href="/terms">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon name="description" className="text-slate-600" />
                  <span className="text-slate-900">Användarvillkor</span>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-400" />
              </div>
            </Link>

            <Link href="/privacy">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon name="privacy_tip" className="text-slate-600" />
                  <span className="text-slate-900">Integritetspolicy</span>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-400" />
              </div>
            </Link>
          </div>
        </Card>

        {/* Sign Out Button */}
        <Card padding="lg">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleSignOut}
            isLoading={isSigningOut}
            icon="logout"
            className="text-error border-error hover:bg-error hover:text-white"
          >
            Logga ut
          </Button>
        </Card>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNavigation />
    </div>
  );
}
