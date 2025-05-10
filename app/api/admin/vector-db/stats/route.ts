import { NextResponse } from "next/server"
import { getVectorDatabaseStats } from "@/lib/vector-database"

export async function GET() {
  try {
    const stats = await getVectorDatabaseStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error getting vector database stats:", error)
    return NextResponse.json({ error: "Failed to get vector database stats" }, { status: 500 })
  }
}
