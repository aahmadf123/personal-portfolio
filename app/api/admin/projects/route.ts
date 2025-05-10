import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * Verify user authentication with proper error handling and token refresh
 */
async function verifyAuth(supabase: any) {
  try {
    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError.message);
      return {
        authenticated: false,
        error: "Authentication error",
        status: 401,
      };
    }

    if (!session) {
      return { authenticated: false, error: "No active session", status: 401 };
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;

    if (expiresAt && now + fiveMinutes >= expiresAt) {
      // Try to refresh the session
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError || !refreshData.session) {
        console.error("Failed to refresh session:", refreshError?.message);
        return { authenticated: false, error: "Session expired", status: 401 };
      }
    }

    return { authenticated: true, userId: session.user.id };
  } catch (error: any) {
    console.error("Authentication verification error:", error.message);
    return {
      authenticated: false,
      error: "Authentication failed",
      status: 500,
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Verify authentication
    const authResult = await verifyAuth(supabase);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Fetch projects with related data
    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_technologies(*),
        project_tags(*),
        project_images(*)
      `
      )
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data for the admin UI
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      thumbnail_url: project.thumbnail_url || project.main_image_url,
      github_url: project.github_url,
      demo_url: project.demo_url,
      is_featured: project.is_featured,
      is_ongoing: project.is_ongoing,
      status: project.status,
      start_date: project.start_date,
      end_date: project.end_date,
      created_at: project.created_at,
      updated_at: project.updated_at,
      view_count: project.view_count || 0,
      technologies:
        project.project_technologies?.map((tech) => tech.name) || [],
      tags: project.project_tags?.map((tag) => tag.name) || [],
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Verify authentication
    const authResult = await verifyAuth(supabase);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Extract fields for new project
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
      is_featured = false,
      is_ongoing = false,
      status = "in-progress",
      technologies = [],
      tags = [],
      challenges = [],
      milestones = [],
      images = [],
      ...otherFields
    } = body;

    // Validate required fields
    if (!title || !slug || !description) {
      return NextResponse.json(
        {
          error: "Title, slug, and description are required",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingProject, error: checkError } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingProject) {
      return NextResponse.json(
        {
          error: "A project with this slug already exists",
        },
        { status: 400 }
      );
    }

    // Begin transaction using PostgreSQL functions
    const { data: transactionResult, error: transactionError } =
      await supabase.rpc("create_project_with_relations", {
        project_data: JSON.stringify({
          title,
          slug,
          description,
          details: details || null,
          summary: summary || description,
          thumbnail_url: thumbnail_url || null,
          main_image_url: main_image_url || thumbnail_url || null,
          github_url: github_url || null,
          demo_url: demo_url || null,
          start_date: start_date || null,
          end_date: end_date || null,
          is_featured,
          is_ongoing: end_date ? false : is_ongoing,
          status,
          ...otherFields,
        }),
        technologies_data: JSON.stringify(
          technologies.map((tech: string) => ({ name: tech }))
        ),
        tags_data: JSON.stringify(tags.map((tag: string) => ({ name: tag }))),
        challenges_data: JSON.stringify(challenges),
        milestones_data: JSON.stringify(milestones),
        images_data: JSON.stringify(
          images.map((image: any, index: number) => ({
            url: image.url,
            alt_text: image.alt_text || title,
            caption: image.caption || "",
            order_index: image.order_index || index,
          }))
        ),
      });

    // If RPC function is not available, fallback to manual transaction
    if (
      transactionError?.message?.includes(
        'function "create_project_with_relations" does not exist'
      )
    ) {
      console.warn(
        "RPC function not available, using manual transaction process"
      );

      // Create the project record
      const projectData = {
        title,
        slug,
        description,
        details: details || null,
        summary: summary || description,
        thumbnail_url: thumbnail_url || null,
        main_image_url: main_image_url || thumbnail_url || null,
        github_url: github_url || null,
        demo_url: demo_url || null,
        start_date: start_date || null,
        end_date: end_date || null,
        is_featured,
        is_ongoing: end_date ? false : is_ongoing,
        status,
        ...otherFields,
      };

      // Start a PostgreSQL transaction
      const { error: txnError } = await supabase.sql("BEGIN");
      if (txnError) {
        console.error("Error starting transaction:", txnError);
        return NextResponse.json(
          { error: "Failed to start transaction" },
          { status: 500 }
        );
      }

      try {
        // Insert project
        const { data: newProject, error: createError } = await supabase
          .from("projects")
          .insert(projectData)
          .select();

        if (createError) {
          throw createError;
        }

        const projectId = newProject[0].id;

        // Handle technologies
        if (technologies.length > 0) {
          const techInserts = technologies.map((tech) => ({
            project_id: projectId,
            name: tech,
          }));

          const { error: techError } = await supabase
            .from("project_technologies")
            .insert(techInserts);

          if (techError) {
            throw techError;
          }
        }

        // Handle tags
        if (tags.length > 0) {
          const tagInserts = tags.map((tag) => ({
            project_id: projectId,
            name: tag,
          }));

          const { error: tagError } = await supabase
            .from("project_tags")
            .insert(tagInserts);

          if (tagError) {
            throw tagError;
          }
        }

        // Handle challenges
        if (challenges.length > 0) {
          const challengeInserts = challenges.map((challenge) => ({
            project_id: projectId,
            title: challenge.title,
            description: challenge.description,
            solution: challenge.solution,
          }));

          const { error: challengeError } = await supabase
            .from("project_challenges")
            .insert(challengeInserts);

          if (challengeError) {
            throw challengeError;
          }
        }

        // Handle milestones
        if (milestones.length > 0) {
          const milestoneInserts = milestones.map((milestone) => ({
            project_id: projectId,
            title: milestone.title,
            description: milestone.description,
            date: milestone.date,
            status: milestone.status || "completed",
          }));

          const { error: milestoneError } = await supabase
            .from("project_milestones")
            .insert(milestoneInserts);

          if (milestoneError) {
            throw milestoneError;
          }
        }

        // Handle images
        if (images.length > 0) {
          const imageInserts = images.map((image, index) => ({
            project_id: projectId,
            url: image.url,
            alt_text: image.alt_text || title,
            caption: image.caption || "",
            order_index: image.order_index || index,
          }));

          const { error: imageError } = await supabase
            .from("project_images")
            .insert(imageInserts);

          if (imageError) {
            throw imageError;
          }
        }

        // Commit the transaction
        const { error: commitError } = await supabase.sql("COMMIT");
        if (commitError) {
          throw commitError;
        }

        return NextResponse.json(
          {
            message: "Project created successfully",
            id: projectId,
            slug,
          },
          { status: 201 }
        );
      } catch (error: any) {
        // Rollback on any error
        await supabase.sql("ROLLBACK");
        console.error("Transaction error:", error);
        return NextResponse.json(
          { error: `Transaction failed: ${error.message}` },
          { status: 500 }
        );
      }
    } else if (transactionError) {
      // Handle other transaction errors
      console.error("Error in transaction:", transactionError);
      return NextResponse.json(
        { error: transactionError.message },
        { status: 500 }
      );
    }

    // If RPC transaction was successful
    const projectId = transactionResult?.project_id;

    return NextResponse.json(
      {
        message: "Project created successfully",
        id: projectId,
        slug,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
