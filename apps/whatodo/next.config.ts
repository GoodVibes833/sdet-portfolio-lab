import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  staticPageGenerationTimeout: 120,
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
} as NextConfig;

export default nextConfig;
