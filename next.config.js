/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        // Exclude infrastructure and lambda files from Next.js type checking
        ignoreBuildErrors: false,
        tsconfigPath: 'tsconfig.json'
    },
    webpack: (config, { isServer }) => {
        // Exclude infrastructure, lambda, and Amplify files from webpack build
        config.watchOptions = {
            ...config.watchOptions,
            ignored: ['**/infrastructure/**', '**/lambda/**', '**/cdk.out/**', '**/amplify/**']
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
            {
                source: '/(.*)',
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
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                    {
                        key: 'Expires',
                        value: new Date(Date.now() + 31536000000).toUTCString(),
                    },
                ],
            },
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig