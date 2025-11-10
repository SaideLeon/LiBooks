
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
             {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            }
        ],
    },
     env: {
        NEXT_PUBLIC_GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    }
};

export default nextConfig;
