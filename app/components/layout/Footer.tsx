'use client';

import React from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/app/components/Icons';

export function Footer() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // TODO: Implement newsletter subscription API
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Tack för din prenumeration!');
      setEmail('');
    } catch (error) {
      setMessage('Något gick fel. Försök igen senare.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1a2332] text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-white text-xl font-bold">
              <span className="text-2xl">🥙</span>
              <span>
                Kebab<span className="text-primary">kartan</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sveriges största guide till den bästa kebaben. Vi hjälper dig hitta rätt i såsdjungeln, en rulle i taget.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/kebabkartan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2a3444] hover:bg-[#3a4454] transition-colors flex items-center justify-center"
                aria-label="Följ oss på Instagram"
              >
                <MaterialIcon name="language" className="text-gray-300" />
              </a>
              <a
                href="https://www.instagram.com/kebabkartan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2a3444] hover:bg-[#3a4454] transition-colors flex items-center justify-center"
                aria-label="Följ oss på Instagram"
              >
                <MaterialIcon name="photo_camera" className="text-gray-300" />
              </a>
              <a
                href="mailto:kontakt@kebabkartan.se"
                className="w-10 h-10 rounded-full bg-[#2a3444] hover:bg-[#3a4454] transition-colors flex items-center justify-center"
                aria-label="Kontakta oss via e-post"
              >
                <MaterialIcon name="alternate_email" className="text-gray-300" />
              </a>
            </div>
          </div>

          {/* Utforska Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Utforska</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Startsida
                </Link>
              </li>
              <li>
                <Link href="/topplistor" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Topplistor
                </Link>
              </li>
              <li>
                <Link href="/kebab-stockholm" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Stockholm
                </Link>
              </li>
              <li>
                <Link href="/kebab-malmo" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Malmö
                </Link>
              </li>
              <li>
                <Link href="/kebab-goteborg" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Göteborg
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Logga in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Bli medlem
                </Link>
              </li>
              <li>
                <Link href="/suggestions" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tipsa oss
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Häng med</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Prenumerera på vårt nyhetsbrev för de senaste recensionerna och hetaste såstipsen.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Din e-post"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#2a3444] border border-[#3a4454] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-primary hover:bg-secondary transition-colors flex items-center justify-center disabled:opacity-50"
                  aria-label="Prenumerera"
                >
                  <MaterialIcon name="send" className="text-white text-lg" />
                </button>
              </div>
              {message && (
                <p className={`text-xs ${message.includes('Tack') ? 'text-success' : 'text-error'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2a3444]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              © 2025 Kebabkartan AB. Alla rättigheter reserverade.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/integritetspolicy" className="text-gray-500 hover:text-white transition-colors text-xs">
                Integritetspolicy
              </Link>
              <Link href="/anvandarvillkor" className="text-gray-500 hover:text-white transition-colors text-xs">
                Användarvillkor
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors text-xs">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
