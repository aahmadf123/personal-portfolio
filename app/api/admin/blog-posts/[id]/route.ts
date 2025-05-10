import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching blog post:", error)
      return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in get blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id
    const postData = await request.json()

    // Extract tags if present
    const tags = postData.tags || []
    delete postData.tags

    // Handle boolean values from string
    if (typeof postData.published === "string") {
      postData.published = postData.published === "true"
    }

    if (typeof postData.featured === "string") {
      postData.featured = postData.featured === "true"
    }

    // Update the blog post
    const { data, error } = await supabase.from("blog_posts").update(postData).eq("id", id).select()

    if (error) {
      console.error("Error updating blog post:", error)
      return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
    }

    // Update tags - first delete existing mappings
    const { error: deleteError } = await supabase.from("blog_post_tags").delete().eq("blog_post_id", id)

    if (deleteError) {
      console.error("Error deleting existing tags:", deleteError)
    }

    // Then add new tag mappings
    if (tags.length > 0) {
      const tagMappings = tags.map((tagId: number) => ({
        blog_post_id: Number.parseInt(id),
        tag_id: tagId,
      }))

      const { error: tagError } = await supabase.from("blog_post_tags").insert(tagMappings)

      if (tagError) {
        console.error("Error adding tags to blog post:", tagError)
      }
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in update blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    // Delete the blog post (this will cascade delete the tag mappings due to foreign key constraints)
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting blog post:", error)
      return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
