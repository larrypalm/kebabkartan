import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./app.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ClientLayout from "./components/ClientLayout";
import AmplifyProvider from "./components/AmplifyProvider";
import StructuredData from "./components/StructuredData";
import MaterialIconsLoader from "./components/MaterialIconsLoader";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ['400', '500', '700'], // Reduced from 5 to 3 weights for performance
    display: 'swap',
    preload: true,
    fallback: ['Inter', 'system-ui', 'arial'],
    variable: '--font-plus-jakarta'
});

export const metadata: Metadata = {
    title: {
        default: 'Kebabkartan | Hitta och betygsätt kebab, pizza & falafel',
        template: '%s | Kebabkartan'
    },
    description: '🔥 Sveriges bästa guide till kebab, pizza & falafel! Hitta toppställen i Stockholm, Göteborg, Malmö & fler städer. Läs äkta recensioner, se betyg & upptäck nya favoriter. Gratis & uppdaterat dagligen!',
    keywords: ['kebab', 'pizza', 'falafel', 'kebabställen', 'pizzerior', 'falafelställen', 'restauranger', 'mat', 'betygsättning', 'Sverige', 'kebabkarta'],
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
        title: 'Kebabkartan | Hitta och betygsätt kebab, pizza & falafel',
        description: 'Hitta och betygsätt kebab, pizza och falafel i Sverige. Utforska ställen nära dig, läs recensioner och dela dina erfarenheter.',
        siteName: 'Kebabkartan',
        images: [
            {
                url: '/static/logo.png',
                width: 1200,
                height: 630,
                alt: 'Kebabkartan - Din guide till kebab, pizza och falafel i Sverige',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kebabkartan | Hitta och betygsätt kebab, pizza & falafel',
        description: 'Hitta och betygsätt kebab, pizza och falafel i Sverige. Utforska ställen nära dig, läs recensioner och dela dina erfarenheter.',
        images: ['/static/logo.png'],
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
        <html lang="sv">
            <head>
                {/* Preconnect to critical domains for faster DNS resolution */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://www.google.com" />
                <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://tile.openstreetmap.org" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* Preload only critical site-wide resources */}
                <link rel="preload" as="image" href="/static/logo-small.webp" type="image/webp" fetchPriority="high" />
                <link rel="preload" as="image" href="/static/logo-small.png" fetchPriority="high" />

                {/* Note: Map tiles are not preloaded here because:
                    1. We can't predict exact visible tiles (depends on viewport size)
                    2. TilePriorityOptimizer component sets fetchpriority="high" dynamically
                    3. We have preconnect to tile.openstreetmap.org for early connection
                */}
            </head>
            <body className={plusJakartaSans.variable}>
                <MaterialIconsLoader />
                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                    <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
                )}
                <AmplifyProvider>
                    <ClientLayout>{children}</ClientLayout>
                </AmplifyProvider>
                <StructuredData type="website" data={null} />
            </body>
        </html>
    );
}
