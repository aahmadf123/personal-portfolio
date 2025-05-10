import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Removed authentication check

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let query = supabase.from("vector_store").select("id, content, metadata")

    // Filter by type if provided
    if (type) {
      query = query.filter("metadata->type", "eq", type)
    }

    // Limit results
    query = query.limit(100)

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching vector records:", error)
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}
