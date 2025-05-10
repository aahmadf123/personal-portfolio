import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Add any middleware logic here
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
