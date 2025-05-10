import { type NextRequest, NextResponse } from "next/server"
import { deleteDocument } from "@/lib/vector-database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await deleteDocument(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
