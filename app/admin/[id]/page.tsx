'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminRedirectPageProps {
    params: {
        id: string;
    };
}

export default function AdminRedirectPage({ params }: AdminRedirectPageProps) {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the places edit page
        router.replace(`/admin/places/${params.id}`);
    }, [router, params.id]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <p>Redirecting to edit page...</p>
            </div>
        </div>
    );
}
