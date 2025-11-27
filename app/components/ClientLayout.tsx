'use client';

import { usePageTracking } from '@/app/hooks/usePageTracking';
import Breadcrumbs from './Breadcrumbs';
import PerformanceOptimizer from './PerformanceOptimizer';
import PerformanceMonitor from './PerformanceMonitor';
import LCPOptimizer from './LCPOptimizer';
import CookieConsent from './CookieConsent';
import AnalyticsDebug from './AnalyticsDebug';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    // Track page views; hook itself guards admin routes
    usePageTracking();
    
    return (
        <>
            <LCPOptimizer />
            <PerformanceOptimizer />
            <PerformanceMonitor />
            <Breadcrumbs />
            {children}
            {!isAdminRoute && (
                <div suppressHydrationWarning>
                    {typeof window !== 'undefined' && <CookieConsent />}
                </div>
            )}
            {!isAdminRoute && <AnalyticsDebug />}
        </>
    );
} 