import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-checkin",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
