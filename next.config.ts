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
    ],
  },
};

export default nextConfig;
