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
      "h4rxhagyxlojdl32.public.blob.vercel-storage.com", // Add Vercel Blob storage
      "supabase-violet-tree.supabase.co", // Add your Supabase storage directly
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Use exportPathMap for better static generation with dynamic routes
  // This ensures all JavaScript chunks are properly generated
  exportPathMap: async function (defaultPathMap) {
    // Preserve the default paths which includes the dynamic ones
    return defaultPathMap;
  },

  // Improve server component handling
  output: "standalone",

  // Improve Netlify integration
  trailingSlash: false, // Ensure consistent URL handling

  // Improve static export handling
  poweredByHeader: false,

  // Improve build process for Netlify
  swcMinify: true,

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    // Properly handle static chunks in App Router
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },

  // Special config for Netlify
  env: {
    NETLIFY: process.env.NETLIFY,
  },
  // Note: For static paths in App Router, use generateStaticParams in your page components
  // instead of exportPathMap which is only for Pages Router
};

export default nextConfig;
