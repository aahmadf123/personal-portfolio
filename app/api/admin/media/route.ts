import { createClient } from "@/lib/supabase"
import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check authentication
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // List all blobs
    const { blobs } = await list()

    const mediaItems = blobs.map((blob) => ({
      id: blob.pathname,
      url: blob.url,
      filename: blob.pathname.split("/").pop() || "unknown",
      pathname: blob.pathname,
      contentType: blob.contentType || "application/octet-stream",
      size: blob.size,
      createdAt: blob.uploadedAt,
      ...(blob.contentType?.startsWith("image/")
        ? {
            width: 0, // We don't have this from the list API
            height: 0, // We don't have this from the list API
          }
        : {}),
    }))

    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error("Error fetching media items:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch media items" },
      { status: 500 },
    )
  }
}
