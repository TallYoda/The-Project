import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Parent folder C:\codes has another lockfile; pin Turbopack to this app.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
