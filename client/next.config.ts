import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The `@doctrac/shared` workspace package lives outside `client/`, at the
  // monorepo root — without this, `next build`'s file tracing defaults to
  // `client/` alone and silently drops shared's source files.
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
