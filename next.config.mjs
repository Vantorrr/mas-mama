/**
 * Next.js config in ESM format to ensure Railway picks it up during Docker/Nixpacks builds.
 * We explicitly disable ESLint and TypeScript type checking during builds on the server.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;


