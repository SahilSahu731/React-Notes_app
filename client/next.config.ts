import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [new URL('https://api.dicebear.com/7.x/initials/svg?seed=User')],
  }
};

export default nextConfig;
