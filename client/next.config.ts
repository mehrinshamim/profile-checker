import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dxpknzqffplmcbjdkwtk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['dxpknzqffplmcbjdkwtk.supabase.co'],
  },
};

export default nextConfig;
