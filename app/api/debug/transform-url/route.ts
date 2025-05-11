import { NextRequest, NextResponse } from "next/server";
import { transformStorageUrl } from "@/lib/storage-utils";

/**
 * API route to transform a URL for testing
 * GET /api/debug/transform-url?url=your-url-here
 */

// Make this API route dynamic (not statically generated)
export const dynamic = "force-dynamic";

// For Netlify static builds, generate a stub response
export const generateStaticParams = async () => {
  // This route doesn't make sense to pre-render, but we need to
  // provide a valid response for static builds
  return [{}];
};

export async function GET(request: NextRequest) {
  // For static builds, return a pre-defined response
  if (process.env.NETLIFY === "true" && process.env.CONTEXT === "production") {
    return NextResponse.json({
      success: true,
      message: "Static build - transformations happen at runtime",
      note: "This is a pre-rendered response. The actual URL transformation occurs at runtime.",
    });
  }

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
