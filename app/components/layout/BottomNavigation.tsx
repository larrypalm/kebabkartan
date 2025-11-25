'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MaterialIcon } from '@/app/components/Icons';

export interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

export interface BottomNavigationProps {
  tabs?: NavigationTab[];
  className?: string;
}

const defaultTabs: NavigationTab[] = [
  {
    id: 'explore',
    label: 'Utforska',
    icon: 'explore',
    href: '/',
  },
  {
    id: 'suggest',
    label: 'Föreslå',
    icon: 'add_location',
    href: '/forslag',
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: 'person',
    href: '/profil',
  },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs = defaultTabs,
  className = '',
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="h-16 md:hidden" />

      {/* Bottom Navigation */}
      <nav
        id="mobile-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 ${className}`}
      >
        <div className="flex items-center justify-around h-16 px-safe">
          {tabs.map((tab) => {
            const active = isActive(tab.href);

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                  active
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
                )}

                {/* Icon */}
                <div className="relative">
                  <MaterialIcon
                    name={tab.icon}
                    fill={active}
                    className={`text-2xl ${
                      active ? 'text-primary' : 'text-slate-500'
                    }`}
                  />

                  {/* Badge */}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-error rounded-full flex items-center justify-center px-1">
                      <span className="text-[10px] font-bold text-white">
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium mt-1 ${
                    active ? 'text-primary' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Safe Area Bottom Padding (for devices with home indicator) */}
        <div className="h-safe bg-white" />
      </nav>
    </>
  );
};

export default BottomNavigation;
