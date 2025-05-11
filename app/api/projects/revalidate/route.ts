import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * API route to manually trigger revalidation of projects data
 * This ensures that both featured projects and regular projects stay in sync
 * POST /api/projects/revalidate
 */
export const dynamic = "force-dynamic"; // Make this route dynamic

export async function POST(request: NextRequest) {
  try {
    // Get secret token from request headers to validate the request
    const authHeader = request.headers.get("authorization");

    // Optional: Validate token in a production environment
    // if (!authHeader || authHeader !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Revalidate the 'projects' tag which is used by both project endpoints
    revalidateTag("projects");

    return NextResponse.json({
      revalidated: true,
      message: "Project data revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating project data:", error);
    return NextResponse.json(
      {
        revalidated: false,
        error: "Failed to revalidate project data",
      },
      { status: 500 }
    );
  }
}

/**
 * API route to manually revalidate projects data
 * Useful after updating projects in the database
 */
export async function GET() {
  try {
    console.log("Manual revalidation of projects requested");

    // Revalidate project-related tags
    revalidateTag("projects");
    revalidateTag("featured-projects");

    // Revalidate specific paths
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/api/projects/featured");

    console.log("Revalidation complete");

    return NextResponse.json(
      {
        success: true,
        message: "Projects revalidated",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revalidate projects",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
