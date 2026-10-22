import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
