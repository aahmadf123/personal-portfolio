import { NextResponse, type NextRequest } from "next/server";
import { isServerRoute } from "./app/server-routes.config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a server route that needs special handling
  if (isServerRoute(pathname)) {
    // For known dynamic routes, ensure they're processed server-side
    // by adding a special header that Netlify's Next.js plugin will recognize
    const response = NextResponse.next();
    response.headers.set("x-middleware-next", "server");
    return response;
  }

  // For regular routes, proceed normally
  return NextResponse.next();
}

// Define paths that should be processed by the middleware
export const config = {
  matcher: [
    // API routes that need special handling
    "/api/:path*",
    "/admin/:path*",
    // Skip static assets and other internal Next.js paths
    "/((?!_next/static|_next/image|favicon.ico|images|logos).*)",
  ],
};
