import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/metro-kids',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
