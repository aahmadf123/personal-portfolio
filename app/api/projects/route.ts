import { type NextRequest, NextResponse } from "next/server";
import { getAllProjects, getFeaturedProjects } from "@/lib/project-service";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : undefined;

    // Use the appropriate service function based on parameters
    const projects = featured
      ? await getFeaturedProjects(limit)
      : await getAllProjects();

    // Add a cache tag for revalidation
    revalidateTag("projects");

    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
