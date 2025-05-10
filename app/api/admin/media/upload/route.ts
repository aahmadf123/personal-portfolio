import { createClient } from "@/lib/supabase"
import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = new Date().getTime()
    const folder = "media"
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filename = `${folder}/${timestamp}-${originalName}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({
      id: blob.pathname,
      url: blob.url,
      pathname: blob.pathname,
      filename: originalName,
      contentType: blob.contentType,
      size: blob.size,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload media" },
      { status: 500 },
    )
  }
}
