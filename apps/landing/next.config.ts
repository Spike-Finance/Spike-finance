import type { NextConfig } from "next";
import { join } from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: join(__dirname, '..', '..'),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
