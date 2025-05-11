import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * API route to manually revalidate all site content
 * Useful after fixing issues with static assets
 */
export const dynamic = "force-dynamic"; // Make this route dynamic

export async function GET() {
  try {
    console.log("Manual revalidation of ALL content requested");

    // Tags used throughout the app
    const tagsToRevalidate = [
      "projects",
      "featured-projects",
      "skills",
      "blog",
      "timeline",
      "research",
      "case-studies",
    ];

    // Revalidate all tags
    for (const tag of tagsToRevalidate) {
      console.log(`Revalidating tag: ${tag}`);
      revalidateTag(tag);
    }

    // Revalidate key paths
    const pathsToRevalidate = [
      "/",
      "/projects",
      "/api/projects/featured",
      "/blog",
      "/case-studies",
    ];

    // Revalidate all paths
    for (const path of pathsToRevalidate) {
      console.log(`Revalidating path: ${path}`);
      revalidatePath(path);
    }

    console.log("Complete revalidation finished");

    return NextResponse.json(
      {
        success: true,
        message: "All content revalidated",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          // Ensure no caching of this response
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Complete revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revalidate content",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
