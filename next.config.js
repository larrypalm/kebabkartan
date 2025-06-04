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
    }
}

module.exports = nextConfig
