import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/project-service";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Get the slug from the URL
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Attempt to retrieve the project with the given slug
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { error: `No project found with slug "${slug}"` },
        { status: 404 }
      );
    }

    // Return the project data
    return NextResponse.json({
      message: "Project found",
      slug,
      project,
    });
  } catch (error) {
    console.error("Error in project slug API:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}
