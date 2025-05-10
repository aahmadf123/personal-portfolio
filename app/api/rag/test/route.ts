import { NextResponse } from "next/server"
import { searchSimilarDocuments } from "@/lib/vector-database"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Search for similar documents
    const contexts = await searchSimilarDocuments(query, 0.5, 5)

    return NextResponse.json({
      query,
      contexts,
    })
  } catch (error) {
    console.error("Error testing RAG:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
