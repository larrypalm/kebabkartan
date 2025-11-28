/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        // Exclude infrastructure and lambda files from Next.js type checking
        ignoreBuildErrors: false,
        tsconfigPath: 'tsconfig.json'
    },
    webpack: (config, { isServer }) => {
        // Exclude infrastructure, lambda, Amplify, and context files from webpack build
        config.watchOptions = {
            ...config.watchOptions,
            ignored: ['**/infrastructure/**', '**/lambda/**', '**/cdk.out/**', '**/amplify/**', '**/context/**']
        };
        return config;
    },
    // SEO and Performance optimizations
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        loader: 'custom',
        loaderFile: './app/lib/imageLoader.js',
    },
    // Enable compression
    compress: true,
    // Optimize for production
    swcMinify: true,
    // Add security and performance headers
    async headers() {
        return [
            // Static assets - long cache (1 year)
            {
                source: '/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Next.js static assets - long cache (1 year)
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Images and fonts - long cache (1 year)
            {
                source: '/:path*.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // API routes - no cache
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate',
                    },
                ],
            },
            // HTML pages - revalidate frequently
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig