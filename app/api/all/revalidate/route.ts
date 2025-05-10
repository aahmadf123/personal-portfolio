import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { validateRevalidationRequest } from "@/lib/revalidation-utils"

export const dynamic = "force-dynamic" // Make this route dynamic

export async function POST(request: NextRequest) {
  try {
    // Validate the request using the new function
    const validationResult = await validateRevalidationRequest(request)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error || "Unauthorized",
        },
        { status: 401 },
      )
    }

    // Revalidate all content paths
    revalidatePath("/api/skills")
    revalidatePath("/api/projects")
    revalidatePath("/api/blog")
    revalidatePath("/api/case-studies")
    revalidatePath("/api/timeline")
    revalidatePath("/api/research-projects")

    // Revalidate all pages
    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath("/blog")
    revalidatePath("/case-studies")
    revalidatePath("/timeline")
    revalidatePath("/research")
    revalidatePath("/research/[slug]")

    return NextResponse.json({
      success: true,
      revalidated: true,
      message: "All content revalidated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error revalidating all content:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to revalidate all content",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
