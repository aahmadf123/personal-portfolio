/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["localhost", "your-project-id.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  // Special config for Netlify
  env: {
    NETLIFY: process.env.NETLIFY,
  },
  // Force fully dynamic rendering for problematic routes
  exportPathMap: async function (defaultPathMap) {
    return defaultPathMap;
  },
};

export default nextConfig;
