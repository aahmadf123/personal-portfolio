import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { handleDatabaseError } from "@/lib/error-utils";
import type { ResearchProject } from "@/types/research-projects";

export const revalidate = 3600; // Revalidate every hour

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Fetch research project with related data
    const { data, error } = await supabase
      .from("research_projects")
      .select(
        `
        *,
        research_project_tags(id, name),
        research_project_challenges(id, description),
        research_project_updates(id, date, text),
        research_project_team_members(id, name, role, is_lead),
        research_project_resources(id, name, url)
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      throw handleDatabaseError(
        error,
        "fetch",
        `research project with slug ${slug}`
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Research project not found" },
        { status: 404 }
      );
    }

    // Process the data to ensure consistent structure
    const project: ResearchProject = {
      ...data,
      tags: data.research_project_tags.map((tag: any) => tag.name),
      challenges: data.research_project_challenges,
      recentUpdates: data.research_project_updates.map((update: any) => ({
        date: new Date(update.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        text: update.text,
      })),
      teamMembers: data.research_project_team_members.map((member: any) =>
        member.is_lead ? `${member.name} (Lead)` : member.name
      ),
      resources: data.research_project_resources,
    };

    return NextResponse.json(project);
  } catch (error) {
    console.error(
      `Error fetching research project with slug ${params.slug}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch research project" },
      { status: 500 }
    );
  }
}
