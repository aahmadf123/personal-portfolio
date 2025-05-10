import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("blog_tags").select("*").order("name")

    if (error) {
      console.error("Error fetching blog tags:", error)
      return NextResponse.json({ error: "Failed to fetch blog tags" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in blog tags API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
