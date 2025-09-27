import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable CSS imports from node_modules
    esmExternals: "loose",
  },
};

export default nextConfig;
