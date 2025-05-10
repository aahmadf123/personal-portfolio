import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { projectSlug, thumbnailUrl, mainImageUrl } = await request.json()

    if (!projectSlug) {
      return NextResponse.json({ success: false, error: "Project slug is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // First check if the project exists
    const { data: existingProject, error: checkError } = await supabase
      .from("projects")
      .select("id, title")
      .eq("slug", projectSlug)
      .single()

    if (checkError) {
      return NextResponse.json({ success: false, error: `Project not found: ${checkError.message}` }, { status: 404 })
    }

    // Update the project images
    const updates: Record<string, any> = {}

    if (thumbnailUrl) updates.thumbnail_url = thumbnailUrl
    if (mainImageUrl) updates.main_image_url = mainImageUrl

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "No image URLs provided for update" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", existingProject.id)
      .select("id, title, slug, thumbnail_url, main_image_url")
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: `Failed to update project images: ${error.message}` },
        { status: 500 },
      )
    }

    // Revalidate the pages
    try {
      const revalidateResponse = await fetch(`${request.nextUrl.origin}/api/projects/clear-cache`, {
        method: "GET",
        cache: "no-store",
      })

      if (!revalidateResponse.ok) {
        console.warn("Failed to revalidate cache after image update")
      }
    } catch (revalidateError) {
      console.error("Error revalidating cache:", revalidateError)
    }

    return NextResponse.json({
      success: true,
      message: `Images updated for project "${existingProject.title}"`,
      data,
    })
  } catch (error) {
    console.error("Error in update-project-images API:", error)
    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 })
  }
}
