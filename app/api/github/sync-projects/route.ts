import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { syncResearchProjectWithGitHub } from "@/lib/github-integration";

// Set to dynamic to ensure this isn't statically generated
export const dynamic = "force-dynamic";

/**
 * API route to manually sync all research projects with their GitHub repositories
 * This can be called periodically to keep projects up to date even without webhooks
 */
export async function GET(request: Request) {
  try {
    // Check for authorization - in production, you should secure this endpoint
    // For now we'll allow any access for testing purposes

    // Get all active research projects with GitHub resources
    const supabase = createServerSupabaseClient();
    const { data: projects, error } = await supabase
      .from("research_projects")
      .select(
        `
        id, title,
        research_project_resources(name, url)
      `
      )
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching research projects:", error);
      return NextResponse.json(
        { error: "Failed to fetch research projects" },
        { status: 500 }
      );
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        message: "No active research projects found",
      });
    }

    // Filter to only projects with GitHub repositories
    const projectsWithGitHub = projects.filter((project) =>
      project.research_project_resources.some(
        (r: any) => r.url && r.url.includes("github.com")
      )
    );

    if (projectsWithGitHub.length === 0) {
      return NextResponse.json({
        message: "No research projects with GitHub repositories found",
      });
    }

    console.log(
      `Found ${projectsWithGitHub.length} research projects with GitHub repositories`
    );

    // Sync each project with its GitHub repository
    const results = await Promise.all(
      projectsWithGitHub.map(async (project) => {
        const success = await syncResearchProjectWithGitHub(project.id);
        return {
          projectId: project.id,
          title: project.title,
          success,
        };
      })
    );

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Synchronized ${successCount} out of ${projectsWithGitHub.length} projects`,
      results,
    });
  } catch (error) {
    console.error("Error syncing research projects with GitHub:", error);
    return NextResponse.json(
      {
        error: "Failed to sync research projects",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
