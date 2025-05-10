import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get all unique categories from the skills table
    const { data, error } = await supabase.from("skills").select("category").order("category")

    if (error) {
      console.error("Error fetching skill categories:", error)
      return NextResponse.json({ error: "Failed to fetch skill categories" }, { status: 500 })
    }

    // Extract unique categories
    const categories = [...new Set(data.map((item) => item.category))]

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error in skill categories API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
