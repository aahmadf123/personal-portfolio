import { NextResponse, type NextRequest } from "next/server";
import { isServerRoute } from "./app/server-routes.config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Special handling for the root path
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Check if this is a server route that needs special handling
  if (isServerRoute(pathname)) {
    // For known dynamic routes, ensure they're processed server-side
    // by adding a special header that Netlify's Next.js plugin will recognize
    const response = NextResponse.next();
    response.headers.set("x-middleware-next", "server");
    return response;
  }

  // For page paths that don't include file extensions (likely page requests)
  if (!pathname.includes(".") && !pathname.startsWith("/_next")) {
    const response = NextResponse.next();
    response.headers.set("x-middleware-next", "server");
    return response;
  }

  // For regular routes, proceed normally
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
