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
      {
        // Pravatar used for some profile avatars
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
