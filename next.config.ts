import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    VERSION: process.env.SOURCE_COMMIT,
  },
};

export default nextConfig;
