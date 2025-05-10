import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { createClient } from "@/lib/supabase"

export async function DELETE(request: NextRequest) {
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
