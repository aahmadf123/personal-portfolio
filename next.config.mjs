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
    // Use environment variable for Supabase domain or fall back to default
    domains: [
      "localhost",
      process.env.SUPABASE_PROJECT_URL || "your-project-id.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Use standalone for server components
  output: "standalone",
  
  // Improve Netlify integration
  trailingSlash: false, // Ensure consistent URL handling
  
  // Improve static export handling
  poweredByHeader: false,
  
  // Improve build process for Netlify
  swcMinify: true,
  
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  
  // Special config for Netlify
  env: {
    NETLIFY: process.env.NETLIFY,
  },
  // Note: For static paths in App Router, use generateStaticParams in your page components
  // instead of exportPathMap which is only for Pages Router
};

export default nextConfig;
