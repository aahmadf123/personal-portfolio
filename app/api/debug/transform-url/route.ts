import { NextRequest, NextResponse } from "next/server";
import { transformStorageUrl } from "@/lib/storage-utils";

/**
 * API route to transform a URL for testing
 * GET /api/debug/transform-url?url=your-url-here
 */
export async function GET(request: NextRequest) {
  try {
    // Get the URL from query parameters
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { success: false, error: "No URL provided" },
        { status: 400 }
      );
    }

    console.log(`Transforming URL via API: ${url}`);

    // Transform the URL
    const transformedUrl = transformStorageUrl(url);

    return NextResponse.json({
      success: transformedUrl !== null,
      originalUrl: url,
      transformedUrl,
      message:
        transformedUrl === null
          ? "Failed to transform URL - no valid URL returned"
          : "URL transformed successfully",
    });
  } catch (error) {
    console.error("Error transforming URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
