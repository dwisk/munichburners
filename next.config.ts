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
  async rewrites() {
    return [
      {
        "source": "/uploads/:match*",
        "destination": `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/uploads/:match*`
      },
      {
        "source": "/stats/:match*",
        "destination": "https://analytics.d2u.de/:match*"
      },
      {
        "source": "/api/send",
        "destination": "https://analytics.d2u.de/api/send"
      }
    ]
  }
};

export default nextConfig;
