import { createClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

// Since Vercel Blob doesn't support metadata updates directly,
// we'll store it in Supabase
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json()

    // Store metadata in Supabase
    const { data: metadataData, error } = await supabase
      .from("media_metadata")
      .upsert({
        blob_id: id,
        metadata: body,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, metadata: metadataData?.[0]?.metadata || body })
  } catch (error) {
    console.error("Error updating media metadata:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update media metadata" },
      { status: 500 },
    )
  }
}
