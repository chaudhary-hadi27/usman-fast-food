import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React strict mode
  reactStrictMode: true,
  
  // React compiler (keep your existing setting)
  reactCompiler: true,
  
  // Image optimization - merged configuration
  images: {
    // All domains combined
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
    ],
    
    // Remote patterns for placeholder.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
    
    // Performance optimizations
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Enable compression
  compress: true,
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;