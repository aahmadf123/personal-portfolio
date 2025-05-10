import { NextResponse, type NextRequest } from "next/server";
import { getAllResearchProjects } from "@/lib/research-project-service";

export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    const projects = await getAllResearchProjects();

    // Log the first project to debug
    if (projects.length > 0) {
      console.log("First research project data:", {
        id: projects[0].id,
        title: projects[0].title,
        startDate: projects[0].startDate,
        endDate: projects[0].endDate,
        daysRemaining: projects[0].daysRemaining,
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching research projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch research projects" },
      { status: 500 }
    );
  }
}
