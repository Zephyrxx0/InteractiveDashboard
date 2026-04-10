import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google user content — profile pictures (TopBar, auth)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Randomuser.me avatars used in task assignees
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;
