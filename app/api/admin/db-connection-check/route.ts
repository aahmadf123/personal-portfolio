import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createClient()

    // Simple query to check if the database is responsive
    const { data, error } = await supabase.from("projects").select("id").limit(1)

    if (error) {
      console.error("Database connection check failed:", error)
      return NextResponse.json({ error: "Database connection failed" }, { status: 200 })
    }

    return NextResponse.json({
      status: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking database connection:", error)
    return NextResponse.json({ error: "Failed to check database connection" }, { status: 200 })
  }
}
