import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { validateRevalidationRequest } from "@/lib/revalidation-utils"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // Validate the request
    const validation = await validateRevalidationRequest(request)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error || "Invalid request",
        },
        { status: 401 },
      )
    }

    // Revalidate the skills page and API
    revalidatePath("/skills")
    revalidatePath("/api/skills")
    revalidatePath("/") // Also revalidate homepage which may show skills

    return NextResponse.json({
      revalidated: true,
      success: true,
      message: "Skills content revalidated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error revalidating skills content:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error revalidating skills content",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
