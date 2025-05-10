import { createClient } from "@/lib/supabase"
import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    // Decode the ID as it might be URL encoded
    const decodedId = decodeURIComponent(id)

    // Delete from Vercel Blob
    await del(decodedId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete media" },
      { status: 500 },
    )
  }
}
