import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

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
