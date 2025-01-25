/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    },
};

export default nextConfig;
