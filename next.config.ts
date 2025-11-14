import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Keep existing domains
    domains: ["images.unsplash.com", "res.cloudinary.com"],

    // Add remotePatterns for placeholder.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",      // optional
        pathname: "/**", // allow all paths under this domain
      },
    ],
  },
  reactCompiler: true,
};

module.exports = nextConfig;
