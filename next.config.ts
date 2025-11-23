
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // This allows serving local files from the `public` directory.
  // While not ideal for a large-scale production app (you'd use a CDN),
  // it's perfect for this development environment.
  server: {
    // This is a hypothetical property to illustrate intent.
    // In a real Next.js app, files in `public` are served automatically.
    // No extra config is needed here, but keeping the structure to explain the change.
  },
};

export default nextConfig;

    