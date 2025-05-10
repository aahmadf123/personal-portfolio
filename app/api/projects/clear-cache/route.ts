import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    // Revalidate the projects page and homepage
    revalidatePath("/projects")
    revalidatePath("/")

    return NextResponse.json({
      success: true,
      message: "Projects cache cleared successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error clearing projects cache:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear projects cache",
      },
      { status: 500 },
    )
  }
}
