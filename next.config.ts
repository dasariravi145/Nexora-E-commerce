import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true" || process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  /* config options here */
  ...(isExport
    ? {
        output: "export",
        images: {
          unoptimized: true,
        },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
