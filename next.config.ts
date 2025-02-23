import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'localhost',
      'munichburners.de',
      'strapi.munichburners.de',
      'admin.munichburners.de',
    ],
  },
};

export default nextConfig;
