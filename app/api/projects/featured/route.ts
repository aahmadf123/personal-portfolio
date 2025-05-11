import { NextResponse } from "next/server";
import { getFeaturedProjects } from "@/lib/project-service";

// Set short revalidation time for dynamic data
export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for ISR
export const generateStaticParams = async () => {
  // Return a default limit for static generation
  return [{}];
};

export async function GET(request: Request) {
  try {
    // Use a fixed limit for static generation
    // In Netlify static builds, we'll just use default limit=3
    let limit = 3;

    // Only try to parse URL in dynamic contexts
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.NETLIFY !== "true"
    ) {
      try {
        const url = new URL(request.url);
        const limitParam = url.searchParams.get("limit");
        if (limitParam) {
          limit = parseInt(limitParam, 10);
        }
      } catch (e) {
        console.warn("URL parsing skipped in static build context");
      }
    }

    // Get featured projects using project-service to maintain consistency
    const featuredProjects = await getFeaturedProjects(limit);

    // Cache headers work better for static generation than revalidateTag
    return NextResponse.json(featuredProjects, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error in featured projects API:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}
