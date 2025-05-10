import { type NextRequest, NextResponse } from "next/server"
import { trackBlogPostView } from "@/lib/analytics-service"

export async function POST(request: NextRequest) {
  try {
    const { id, slug, referrer } = await request.json()

    if (!id || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user agent and IP for analytics
    const userAgent = request.headers.get("user-agent") || null

    // Hash the IP address for privacy
    const ipAddress = request.ip || request.headers.get("x-forwarded-for")?.split(",")[0] || null
    let ipHash = null
    if (ipAddress) {
      const encoder = new TextEncoder()
      const data = encoder.encode(ipAddress + process.env.SUPABASE_JWT_SECRET) // Salt with a secret
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      ipHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    }

    await trackBlogPostView(id, slug, userAgent, ipHash, referrer)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking blog post view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
