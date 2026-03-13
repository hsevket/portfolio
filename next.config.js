/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization — add your domains here
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        // For GitHub profile pictures
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // If you use Cloudinary for image hosting
      },
    ],
  },

  // Optimize production build
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // API rewrites (optional — if you want cleaner URLs)
  async rewrites() {
    return [
      {
        source: "/blog/:slug",
        destination: "/articles/:slug",
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
