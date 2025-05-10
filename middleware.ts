import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add any middleware logic here

  // Don't handle 404s in middleware - let vercel.json handle it
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
