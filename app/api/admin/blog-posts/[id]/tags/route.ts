import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    // Get all tags for this blog post
    const { data, error } = await supabase
      .from("blog_post_tags")
      .select(`
        tag_id,
        blog_tags!inner(id, name, slug)
      `)
      .eq("blog_post_id", id)

    if (error) {
      console.error("Error fetching blog post tags:", error)
      return NextResponse.json({ error: "Failed to fetch blog post tags" }, { status: 500 })
    }

    // Transform the data to a simpler format
    const tags = data.map((item) => ({
      id: item.tag_id,
      name: item.blog_tags.name,
      slug: item.blog_tags.slug,
    }))

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error in get blog post tags API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
