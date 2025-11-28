'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MaterialIcon } from '@/app/components/Icons';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut as amplifySignOut } from 'aws-amplify/auth';

export interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  variant?: 'default' | 'transparent' | 'solid';
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  showSearch = true,
  variant = 'default',
  className = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);

  // On frontpage, hide mobile search icon since search bar is in page content
  const isFrontpage = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await amplifySignOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isLoggedIn = !!user;
  const userName = user?.username;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const variantClasses = {
    default: 'bg-white/95 border-b border-slate-200',
    transparent: 'bg-transparent',
    solid: 'bg-white border-b border-slate-200',
  };

  const cities = [
    { name: 'Stockholm', slug: 'stockholm' },
    { name: 'Göteborg', slug: 'goteborg' },
    { name: 'Malmö', slug: 'malmo' },
    { name: 'Jönköping', slug: 'jonkoping' },
    { name: 'Linköping', slug: 'linkoping' },
    { name: 'Lund', slug: 'lund' },
  ];

  return (
    <header className={`sticky top-0 ${variantClasses[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8">
              <picture>
                <source srcSet="/static/logo-small.webp" type="image/webp" />
                <img
                  src="/static/logo-small.png"
                  alt="Kebabkartan logo"
                  width="32"
                  height="32"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Utforska
            </Link>

            {/* Cities Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCitiesDropdown(!showCitiesDropdown)}
                onMouseEnter={() => setShowCitiesDropdown(true)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                Städer
                <MaterialIcon
                  name="keyboard_arrow_down"
                  className="text-slate-600 text-sm"
                />
              </button>

              {/* Cities Dropdown Menu */}
              {showCitiesDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setShowCitiesDropdown(false)}
                  />

                  {/* Menu */}
                  <div
                    className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-card-lg border border-slate-200 py-2 z-[9999]"
                    onMouseLeave={() => setShowCitiesDropdown(false)}
                  >
                    {cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/kebab-${city.slug}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowCitiesDropdown(false)}
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {isLoggedIn && (
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Toggle - Hidden on frontpage since search is in page content */}
            {showSearch && !isFrontpage && (
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Sök"
              >
                <MaterialIcon name="search" className="text-slate-700" />
              </button>
            )}

            {/* User Menu or Auth Buttons */}
            {!mounted || loading ? (
              // Skeleton to prevent layout shift
              <div className="h-9 w-24 bg-slate-200 rounded-full animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Användarmeny"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <MaterialIcon
                    name="keyboard_arrow_down"
                    className="text-slate-600 hidden sm:block"
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-[9998]"
                      onClick={() => setShowUserMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card-lg border border-slate-200 py-2 z-[9999]">
                      {userName && (
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-bold text-slate-900">{userName}</p>
                          <p className="text-sm text-text-muted">Min profil</p>
                        </div>
                      )}

                      <Link
                        href="/profil"
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MaterialIcon name="person" size="sm" className="text-slate-600" />
                        <span className="text-sm text-slate-700">Profil</span>
                      </Link>

                      <Link
                        href="/mina-recensioner"
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MaterialIcon name="rate_review" size="sm" className="text-slate-600" />
                        <span className="text-sm text-slate-700">Mina recensioner</span>
                      </Link>

                      <Link
                        href="/favoriter"
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MaterialIcon name="favorite" size="sm" className="text-slate-600" />
                        <span className="text-sm text-slate-700">Favoriter</span>
                      </Link>

                      <Link
                        href="/installningar"
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MaterialIcon name="settings" size="sm" className="text-slate-600" />
                        <span className="text-sm text-slate-700">Inställningar</span>
                      </Link>

                      <div className="border-t border-slate-100 my-2" />

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-error"
                      >
                        <MaterialIcon name="logout" size="sm" />
                        <span className="text-sm font-medium">Logga ut</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-700 hover:text-slate-900"
                  >
                    Logga in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="primary"
                    size="sm"
                  >
                    Skapa konto
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (Expanded) */}
        {showSearch && isSearchExpanded && (
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearchSubmit}>
              <Input
                icon="search"
                placeholder="Sök restaurang, stad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="filled"
                fullWidth
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
