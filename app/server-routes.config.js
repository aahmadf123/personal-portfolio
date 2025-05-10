/**
 * This file defines routes that should be handled as server-side routes
 * when deploying to Netlify to avoid "NextRouter was not mounted" errors.
 */

export const dynamicRoutes = [
  // API routes
  '/api/projects/clear-cache',
  '/api/blog/featured',
  '/api/admin/vector-db/records',
  '/api/github/stats',
  '/api/projects',
  
  // Admin routes
  '/admin/database-schema',
  '/admin/seed-database',
  '/admin/ai-tools',
  
  // Add any other dynamic routes here
];

/**
 * Use this helper to check if a route should be rendered as server-side
 */
export function isServerRoute(path) {
  return dynamicRoutes.some(route => {
    // Check for exact matches or pattern matches (routes ending with *)
    if (route.endsWith('*')) {
      const baseRoute = route.slice(0, -1);
      return path.startsWith(baseRoute);
    }
    return path === route;
  });
} 