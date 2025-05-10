import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { validateRevalidationRequest } from "@/lib/revalidation-utils"

export const dynamic = "force-dynamic" // Make this route dynamic

export async function POST(request: NextRequest) {
  try {
    // Validate the request using the new function
    const validationResult = await validateRevalidationRequest(request)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 401 })
    }

    // Revalidate the blog API and pages
    revalidatePath("/api/blog")
    revalidatePath("/blog")
    revalidatePath("/") // Revalidate homepage which may show featured blog posts

    return NextResponse.json({
      revalidated: true,
      message: "Blog posts revalidated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error revalidating blog posts:", error)
    return NextResponse.json({ error: "Failed to revalidate blog posts" }, { status: 500 })
  }
}
