import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Kebabkartan',
    description: 'Kebabkartan | betygsätt din favorit kebab!',
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
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
