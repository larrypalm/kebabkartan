'use client';

import { usePageTracking } from '../hooks/usePageTracking';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    usePageTracking();
    
    return <>{children}</>;
} 