import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: {
    compilationMode: "infer",
    panicThreshold: "none",
  },
};

export default nextConfig;
