import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// Get a specific project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch project with all related data
    const { data: project, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_technologies(*),
        project_tags(*),
        project_challenges(*),
        project_milestones(*),
        project_images(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching project ${id}:`, error);
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "PGRST116" ? 404 : 500 }
      );
    }

    // Transform the data for the frontend
    const transformedProject = {
      ...project,
      technologies:
        project.project_technologies?.map((tech) => tech.name) || [],
      tags: project.project_tags?.map((tag) => tag.name) || [],
      challenges: project.project_challenges || [],
      milestones: project.project_milestones || [],
      images:
        project.project_images?.map((img) => ({
          id: img.id,
          url: img.url,
          alt_text: img.alt_text || project.title,
          caption: img.caption || "",
          order_index: img.order_index || 0,
        })) || [],
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Update a specific project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract fields to update the project
    const {
      title,
      slug,
      description,
      details,
      summary,
      thumbnail_url,
      main_image_url,
      github_url,
      demo_url,
      start_date,
      end_date,
      is_featured,
      is_ongoing,
      status,
      technologies,
      tags,
      challenges,
      milestones,
      images,
      ...otherFields
    } = body;

    // Update the project
    const projectData = {
      title,
      slug,
      description,
      details,
      summary: summary || description,
      thumbnail_url,
      main_image_url,
      github_url,
      demo_url,
      start_date,
      end_date,
      is_featured,
      is_ongoing,
      status,
      ...otherFields,
    };

    // Update the main project record
    const { data, error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Error updating project ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle technologies update
    if (technologies && Array.isArray(technologies)) {
      // First delete existing technologies
      await supabase.from("project_technologies").delete().eq("project_id", id);

      // Then insert new ones
      for (const tech of technologies) {
        await supabase.from("project_technologies").insert({
          project_id: id,
          name: tech,
        });
      }
    }

    // Handle tags update
    if (tags && Array.isArray(tags)) {
      // First delete existing tags
      await supabase.from("project_tags").delete().eq("project_id", id);

      // Then insert new ones
      for (const tag of tags) {
        await supabase.from("project_tags").insert({
          project_id: id,
          name: tag,
        });
      }
    }

    // Handle challenges update
    if (challenges && Array.isArray(challenges)) {
      // First delete existing challenges
      await supabase.from("project_challenges").delete().eq("project_id", id);

      // Then insert new ones
      for (const challenge of challenges) {
        await supabase.from("project_challenges").insert({
          project_id: id,
          title: challenge.title,
          description: challenge.description,
          solution: challenge.solution,
        });
      }
    }

    // Handle milestones update
    if (milestones && Array.isArray(milestones)) {
      // First delete existing milestones
      await supabase.from("project_milestones").delete().eq("project_id", id);

      // Then insert new ones
      for (const milestone of milestones) {
        await supabase.from("project_milestones").insert({
          project_id: id,
          title: milestone.title,
          description: milestone.description,
          date: milestone.date,
          status: milestone.status || "completed",
        });
      }
    }

    // Handle images update if provided
    if (images && Array.isArray(images)) {
      // Update or insert images
      for (const image of images) {
        if (image.id) {
          // Update existing image
          await supabase
            .from("project_images")
            .update({
              url: image.url,
              alt_text: image.alt_text,
              caption: image.caption,
              order_index: image.order_index,
            })
            .eq("id", image.id);
        } else {
          // Insert new image
          await supabase.from("project_images").insert({
            project_id: id,
            url: image.url,
            alt_text: image.alt_text,
            caption: image.caption,
            order_index: image.order_index || 0,
          });
        }
      }
    }

    return NextResponse.json({
      message: "Project updated successfully",
      id,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Delete a specific project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete related records first
    await supabase.from("project_technologies").delete().eq("project_id", id);
    await supabase.from("project_tags").delete().eq("project_id", id);
    await supabase.from("project_challenges").delete().eq("project_id", id);
    await supabase.from("project_milestones").delete().eq("project_id", id);
    await supabase.from("project_images").delete().eq("project_id", id);

    // Delete the project
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting project ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
