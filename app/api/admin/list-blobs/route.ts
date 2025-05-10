import { type NextRequest, NextResponse } from "next/server"
import { list } from "@vercel/blob"
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
    const prefix = searchParams.get("prefix") || ""

    const { blobs } = await list({ prefix })

    return NextResponse.json({
      images: blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType || "image/jpeg",
        size: blob.size,
        uploadedAt: new Date(blob.uploadedAt),
      })),
    })
  } catch (error) {
    console.error("Error listing images:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list images" },
      { status: 500 },
    )
  }
}
