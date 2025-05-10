import { type NextRequest, NextResponse } from "next/server"
import { storeDocument } from "@/lib/vector-database"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { content, metadata = {} } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const id = `custom-${uuidv4()}`
    await storeDocument(id, content, metadata)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error storing document:", error)
    return NextResponse.json({ error: "Failed to store document" }, { status: 500 })
  }
}
