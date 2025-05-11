/**
 * Helper function to determine if a route should be treated as a server-side route on Netlify
 */
export function isServerRoute(pathname: string): boolean {
  // Define patterns for routes that should be server-rendered
  const serverRoutePatterns = [
    // Dynamic content pages
    /^\/projects\/[^/]+$/, // Project detail pages
    /^\/blog\/[^/]+$/, // Blog post detail pages
    /^\/research\/[^/]+$/, // Research project detail pages

    // API routes
    /^\/api\/projects\/featured/,
    /^\/api\/projects\/clear-cache/,
    /^\/api\/projects\/[^/]+/, // Proper pattern for dynamic segments
    /^\/api\/research-projects\/featured/,
    /^\/api\/research-projects\/revalidate/,
    /^\/api\/blog\/featured/,
    /^\/api\/admin\/.*/,
    /^\/api\/skills\/.*/,
    /^\/api\/all\/revalidate/,
    /^\/api\/analytics\/.*/,
    /^\/api\/cron\/.*/,

    // AI and chat routes
    /^\/api\/chat\/.*/,
    /^\/api\/chat$/,
    /^\/api\/admin\/assistant\/.*/,
    /^\/api\/admin\/assistant$/,
    /^\/api\/rag\/.*/,

    // Admin routes
    /^\/admin\/.*/,
  ];

  // Check if the pathname matches any server route pattern
  return serverRoutePatterns.some((pattern) => pattern.test(pathname));
}
