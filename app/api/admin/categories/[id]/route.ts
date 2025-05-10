import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching category:", error)
      return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in get category API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
