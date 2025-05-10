import { NextResponse, type NextRequest } from "next/server";
import { getFeaturedResearchProjects } from "@/lib/research-project-service";

export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Number.parseInt(searchParams.get("limit") || "3", 10);

    const projects = await getFeaturedResearchProjects(limit);

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching featured research projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured research projects" },
      { status: 500 }
    );
  }
}
