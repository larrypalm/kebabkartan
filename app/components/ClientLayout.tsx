'use client';

import { usePageTracking } from '@/app/hooks/usePageTracking';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    usePageTracking();
    
    return <>{children}</>;
} 