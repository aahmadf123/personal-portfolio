import { NextResponse } from "next/server";
import { getFeaturedProjects } from "@/lib/project-service";
import { revalidateTag } from "next/cache";

// Set short revalidation time for dynamic data
export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for just the default case
export const generateStaticParams = async () => {
  return [{}]; // Default params with no limit
};

export async function GET(request: Request) {
  try {
    // Extract limit from query string if needed
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit")
      ? parseInt(url.searchParams.get("limit") as string, 10)
      : 3;

    // Get featured projects using project-service to maintain consistency
    // This ensures the same data source is used for both featured and all projects
    const featuredProjects = await getFeaturedProjects(limit);

    // Add a cache tag for revalidation
    revalidateTag("projects");

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
