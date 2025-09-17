'use client';

import { usePageTracking } from '@/app/hooks/usePageTracking';
import Breadcrumbs from './Breadcrumbs';
import PerformanceOptimizer from './PerformanceOptimizer';
import PerformanceMonitor from './PerformanceMonitor';
import LCPOptimizer from './LCPOptimizer';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    usePageTracking();
    
    return (
        <>
            <LCPOptimizer />
            <PerformanceOptimizer />
            <PerformanceMonitor />
            <Breadcrumbs />
            {children}
        </>
    );
} 