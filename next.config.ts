import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: {
    compilationMode: "infer",
    panicThreshold: "none",
  },
  // https://docs.reown.com/appkit/next/core/installation#extra-configuration
  serverExternalPackages: ["pino-pretty", "lokijs", "encoding"],
};

export default nextConfig;
