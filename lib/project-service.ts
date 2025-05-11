import { createServerSupabaseClient } from "./supabase";
import type { Project } from "../types/projects";
import {
  handleDatabaseError,
  retryOperation,
  validateRequiredFields,
} from "./error-utils";

// Helper function to process project data consistently
function processProjectData(project: any): Project {
  // Extract tags from project_tags relation
  const tags = project.project_tags
    ? project.project_tags.map((tag: any) =>
        typeof tag === "string" ? tag : tag.name
      )
    : [];

  // Extract technologies from project_technologies relation
  const technologies = project.project_technologies
    ? project.project_technologies.map((tech: any) =>
        typeof tech === "string" ? tech : tech.name
      )
    : [];

  // Find main image URL with proper fallbacks
  const mainImage = project.project_images?.find((img: any) => img.is_main);
  const thumbnailUrl = project.thumbnail_url || null;
  const mainImageUrl = mainImage?.url || project.main_image_url || null;

  // Calculate image URL from existing fields
  const imageUrl = thumbnailUrl || mainImageUrl || null;

  // Process dates for consistent format
  const startDate = project.start_date ? new Date(project.start_date) : null;
  const endDate = project.end_date ? new Date(project.end_date) : null;

  return {
    ...project,
    tags,
    technologies,
    thumbnail_url: thumbnailUrl,
    main_image_url: mainImageUrl,
    image_url: imageUrl,
    start_date: startDate ? startDate.toISOString() : null,
    end_date: endDate ? endDate.toISOString() : null,
    // Ensure these fields exist with defaults if needed
    completion: project.completion || 100,
    priority: project.priority || "medium",
    is_featured: project.is_featured || false,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Use the Supabase client directly for better reliability
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          project_tags (*),
          project_technologies (*),
          project_images (*)
        `
        )
        .order("order_index", "asc");

      if (error) {
        throw handleDatabaseError(error, "fetch", "projects");
      }

      // Process the data to ensure consistent structure
      return (data || []).map(processProjectData);
    });
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    // Return empty array instead of fallback data
    return [];
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Use the Supabase client directly for better reliability
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          project_tags (*),
          project_technologies (*),
          project_images (*)
        `
        )
        .eq("is_featured", true)
        .order("order_index", "asc")
        .limit(limit);

      if (error) {
        throw handleDatabaseError(error, "fetch", "featured projects", {
          limit,
        });
      }

      // Process the data to ensure consistent structure
      return (data || []).map(processProjectData);
    });
  } catch (error) {
    console.error("Error in getFeaturedProjects:", error);
    // Return empty array instead of using fallback data
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!slug) {
    console.error("Invalid slug provided to getProjectBySlug");
    return null;
  }

  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Use the Supabase client directly for better reliability
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          project_tags (*),
          project_technologies (*),
          project_images (*)
        `
        )
        .eq("slug", slug)
        .single();

      if (error) {
        // If the error is "not found", don't throw an error, just return null
        if (error.code === "PGRST116") {
          console.log(`No project found with slug ${slug}`);
          return null;
        }

        throw handleDatabaseError(error, "fetch", `project with slug ${slug}`, {
          slug,
        });
      }

      // Process the data to ensure consistent structure
      return processProjectData(data);
    });
  } catch (error) {
    console.error(`Error in getProjectBySlug for slug ${slug}:`, error);
    return null;
  }
}

// Keep the rest of the functions as they are
export async function createProject(
  project: Partial<Project>
): Promise<Project | null> {
  try {
    // Validate required fields
    validateRequiredFields(
      project,
      ["title", "slug", "description"],
      "project"
    );

    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("projects")
        .insert([project])
        .select()
        .single();

      if (error) {
        throw handleDatabaseError(error, "create", "project", { project });
      }

      return data;
    });
  } catch (error) {
    console.error("Error in createProject:", error);
    throw error; // Re-throw for API routes to handle
  }
}

export async function updateProject(
  id: number,
  project: Partial<Project>
): Promise<Project | null> {
  if (!id || isNaN(id)) {
    throw new Error("Invalid project ID provided to updateProject");
  }

  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("projects")
        .update(project)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw handleDatabaseError(error, "update", `project with ID ${id}`, {
          id,
          project,
        });
      }

      return data;
    });
  } catch (error) {
    console.error(`Error in updateProject for ID ${id}:`, error);
    throw error; // Re-throw for API routes to handle
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  if (!id || isNaN(id)) {
    throw new Error("Invalid project ID provided to deleteProject");
  }

  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        throw handleDatabaseError(error, "delete", `project with ID ${id}`, {
          id,
        });
      }

      return true;
    });
  } catch (error) {
    console.error(`Error in deleteProject for ID ${id}:`, error);
    throw error; // Re-throw for API routes to handle
  }
}
