import { type NextRequest, NextResponse } from "next/server"
import { searchSimilarDocuments } from "@/lib/vector-database"

export async function POST(request: NextRequest) {
  try {
    const { query, threshold = 0.7, limit = 10 } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const results = await searchSimilarDocuments(query, threshold, limit)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching vector database:", error)
    return NextResponse.json({ error: "Failed to search vector database" }, { status: 500 })
  }
}
