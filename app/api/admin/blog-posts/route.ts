import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Get query parameters
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")
    const featured = url.searchParams.get("featured") === "true"
    const published = url.searchParams.get("published") === "true"

    // Build query
    let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).limit(limit)

    // Apply filters if provided
    if (url.searchParams.has("featured")) {
      query = query.eq("featured", featured)
    }

    if (url.searchParams.has("published")) {
      query = query.eq("published", published)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching blog posts:", error)
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in blog posts API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const postData = await request.json()

    // Extract tags if present
    const tags = postData.tags || []
    delete postData.tags

    // Insert the blog post
    const { data, error } = await supabase.from("blog_posts").insert(postData).select()

    if (error) {
      console.error("Error creating blog post:", error)
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    // If we have tags, add them to the blog_post_tags table
    if (tags.length > 0 && data && data.length > 0) {
      const postId = data[0].id

      const tagMappings = tags.map((tagId: number) => ({
        blog_post_id: postId,
        tag_id: tagId,
      }))

      const { error: tagError } = await supabase.from("blog_post_tags").insert(tagMappings)

      if (tagError) {
        console.error("Error adding tags to blog post:", tagError)
      }
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in create blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
