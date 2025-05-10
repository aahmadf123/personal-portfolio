import { type NextRequest, NextResponse } from "next/server"
import { put, del, list } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    // Removed authentication check

    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique filename with folder structure
    const timestamp = new Date().getTime()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filename = `${folder}/${timestamp}-${originalName}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: blob.size,
      uploadedAt: new Date(),
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Removed authentication check

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

export async function DELETE(request: NextRequest) {
  try {
    // Removed authentication check

    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get("pathname")

    if (!pathname) {
      return NextResponse.json({ error: "No pathname provided" }, { status: 400 })
    }

    await del(pathname)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete image" },
      { status: 500 },
    )
  }
}
