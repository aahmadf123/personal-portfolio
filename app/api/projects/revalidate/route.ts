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

    // Revalidate the projects API and pages
    revalidatePath("/api/projects")
    revalidatePath("/projects")
    revalidatePath("/") // Revalidate homepage which may show featured projects

    return NextResponse.json({
      revalidated: true,
      message: "Projects revalidated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error revalidating projects:", error)
    return NextResponse.json({ error: "Failed to revalidate projects" }, { status: 500 })
  }
}
