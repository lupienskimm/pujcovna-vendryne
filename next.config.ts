import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Fewer candidates → smaller HTML srcSet + less wasted decode work
    deviceSizes: [640, 1080],
    imageSizes: [64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.pujcovnavendryne.cz",
      },
      {
        protocol: "http",
        hostname: "www.pujcovnavendryne.cz",
      },
      {
        protocol: "https",
        hostname: "pujcovnavendryne.cz",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
