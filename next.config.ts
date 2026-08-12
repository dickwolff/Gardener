import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    VERSION: process.env.SOURCE_COMMIT,
  },
};

export default nextConfig;
