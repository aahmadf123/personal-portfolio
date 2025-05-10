import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic"; // Make this route dynamic

// This endpoint will be called by a scheduled task
export async function GET(request: NextRequest) {
  try {
    // For scheduled jobs, we'll check the authorization header
    const authHeader = request.headers.get("authorization");

    // Check if the request is authorized
    if (authHeader !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revalidate all content paths
    revalidatePath("/api/skills");
    revalidatePath("/api/projects");
    revalidatePath("/api/blog");
    revalidatePath("/api/case-studies");
    revalidatePath("/api/timeline");
    revalidatePath("/api/research-projects");

    // Revalidate all pages
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/blog");
    revalidatePath("/case-studies");
    revalidatePath("/timeline");
    revalidatePath("/research");
    revalidatePath("/research/[slug]");

    return NextResponse.json({
      revalidated: true,
      message: "All content revalidated successfully via scheduled task",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in scheduled revalidation:", error);
    return NextResponse.json(
      { error: "Failed to revalidate via scheduled task" },
      { status: 500 }
    );
  }
}

// Runtime configuration
export const config = {
  runtime: "edge",
};
