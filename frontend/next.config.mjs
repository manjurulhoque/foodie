/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "9000",
            },
            {
                protocol: "https",
                hostname: "foodish-api.com",
            },  
        ],
    },
    output: 'standalone',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
