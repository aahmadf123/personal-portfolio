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
      "lknrbdxbdhuwlelrmszq.supabase.co",
      "assets.vercel.com",
      "github.com",
      "raw.githubusercontent.com",
      "images.unsplash.com",
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
  // Note: For static paths in App Router, use generateStaticParams in your page components
  // instead of exportPathMap which is only for Pages Router

  // Improve server component handling
  output: "standalone",

  // Improve Netlify integration
  trailingSlash: false, // Ensure consistent URL handling

  // Improve static export handling
  poweredByHeader: false,

  // Improve build process for Netlify
  swcMinify: true,

  // Configure dynamic routes for Netlify build
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    // Properly handle static chunks in App Router
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
    forceStatic: true,
    serverComponents: true,
  },

  // Special config for Netlify
  env: {
    NETLIFY: process.env.NETLIFY,
    // Make sure the service role key is available during build
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Indicate which API routes should always be dynamic (not statically generated)
  // This helps with the "Dynamic server usage" errors
  serverRuntimeConfig: {
    dynamicApiRoutes: [
      "/api/debug/transform-url",
      "/api/projects/featured",
      "/api/admin/db-pool-stats",
    ],
  },

  // Configure for Netlify Edge Functions
  webpack: (config, { isServer }) => {
    if (isServer) {
      // This ensures middleware is bundled correctly for Edge runtime
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        return entries;
      };
    }
    return config;
  },
};

export default nextConfig;
