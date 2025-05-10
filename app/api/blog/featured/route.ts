import { type NextRequest, NextResponse } from "next/server"
import { getFeaturedPosts } from "@/lib/blog-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "3", 10)

    const posts = await getFeaturedPosts(limit)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching featured posts:", error)
    return NextResponse.json({ error: "Failed to fetch featured posts" }, { status: 500 })
  }
}
