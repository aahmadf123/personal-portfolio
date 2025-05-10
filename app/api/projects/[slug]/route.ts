import { type NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/project-service";

export const revalidate = 3600; // Revalidate every hour

interface Params {
  slug: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Project slug is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching project with slug: ${slug}`);
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(`Found project: ${project.title} with images:`, {
      thumbnail_url: project.thumbnail_url,
      main_image_url: project.main_image_url,
      image_url: project.image_url,
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
