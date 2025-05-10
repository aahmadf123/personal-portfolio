import { type NextRequest, NextResponse } from "next/server";
import { getAllProjects, getFeaturedProjects } from "@/lib/project-service";

export const dynamic = "force-dynamic";

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

    // If limit is specified and featured is not true, apply the limit here
    const limitedProjects =
      limit && !featured ? projects.slice(0, limit) : projects;

    return NextResponse.json({ data: limitedProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
