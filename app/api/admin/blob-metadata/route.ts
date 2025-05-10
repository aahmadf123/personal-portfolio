import { type NextRequest, NextResponse } from "next/server"
import { head } from "@vercel/blob"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get("pathname")

    if (!pathname) {
      return NextResponse.json({ error: "No pathname provided" }, { status: 400 })
    }

    const blob = await head(pathname)

    if (!blob) {
      return NextResponse.json({ error: "Blob not found" }, { status: 404 })
    }

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || "image/jpeg",
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    })
  } catch (error) {
    console.error("Error getting image metadata:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get metadata" },
      { status: 500 },
    )
  }
}
