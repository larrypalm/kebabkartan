'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/app/utils/analytics';

export function usePageTracking() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname?.startsWith('/admin')) {
            trackPageView(pathname);
        }
    }, [pathname]);
} 