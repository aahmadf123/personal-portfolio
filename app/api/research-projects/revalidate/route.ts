import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { validateRevalidationRequest } from "@/lib/revalidation-utils"

export const dynamic = "force-dynamic" // Make this route dynamic

export async function POST(request: NextRequest) {
  try {
    // Validate the request
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

    // Revalidate the research projects pages
    revalidatePath("/research")
    revalidatePath("/research/[slug]")
    revalidatePath("/")

    return NextResponse.json({
      success: true,
      revalidated: true,
      message: "Research projects revalidated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error revalidating research projects:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to revalidate research projects",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
