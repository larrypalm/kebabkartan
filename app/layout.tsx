import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ClientLayout from "./components/ClientLayout";
import AmplifyProvider from "./components/AmplifyProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: 'Kebabkartan | Hitta och betygsätt din favorit kebab',
        template: '%s | Kebabkartan'
    },
    description: 'Hitta och betygsätt din favorit kebab i Sverige. Utforska kebabställen nära dig, läs recensioner och dela dina erfarenheter.',
    keywords: ['kebab', 'kebabställen', 'restauranger', 'mat', 'betygsättning', 'Sverige', 'kebabkarta'],
    authors: [{ name: 'Kebabkartan' }],
    creator: 'Kebabkartan',
    publisher: 'Kebabkartan',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://www.kebabkartan.se'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'sv_SE',
        url: 'https://www.kebabkartan.se',
        title: 'Kebabkartan | Hitta och betygsätt din favorit kebab',
        description: 'Hitta och betygsätt din favorit kebab i Sverige. Utforska kebabställen nära dig, läs recensioner och dela dina erfarenheter.',
        siteName: 'Kebabkartan',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Kebabkartan - Din guide till bästa kebaben i Sverige',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kebabkartan | Hitta och betygsätt din favorit kebab',
        description: 'Hitta och betygsätt din favorit kebab i Sverige. Utforska kebabställen nära dig, läs recensioner och dela dina erfarenheter.',
        images: ['/og-image.jpg'],
        creator: '@kebabkartan',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://www.google.com" />
                <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://tile.openstreetmap.org" />
                <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <script type="module" src="/_next/static/chunks/main.js" async />
                <script noModule src="/_next/static/chunks/main-legacy.js" async />
                {/* Preload OpenStreetMap tiles for LCP optimization */}
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/17/8.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/17/7.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/16/8.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/18/8.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/17/9.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/16/7.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/18/7.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/16/9.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/18/9.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/17/6.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/15/8.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/19/8.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/17/10.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/16/6.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/18/6.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/15/7.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/19/7.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/15/9.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/19/9.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/16/10.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/18/10.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/15/6.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/19/6.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/15/10.png" />
                <link rel="preload" as="image" href="https://tile.openstreetmap.org/5/19/10.png" />
            </head>
            <body className={inter.className}>
                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                    <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
                )}
                <AmplifyProvider>
                    <ClientLayout>{children}</ClientLayout>
                </AmplifyProvider>
            </body>
        </html>
    );
}
