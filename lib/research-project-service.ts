import { createServerSupabaseClient } from "./supabase";
import { handleDatabaseError, retryOperation } from "./error-utils";
import type { ResearchProject } from "@/types/research-projects";

// Get all research projects
export async function getAllResearchProjects(): Promise<ResearchProject[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Fetch research projects with related data
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
        .order("priority", { ascending: true })
        .order("completion", { ascending: false })
        .eq("is_active", true);

      if (error) {
        throw handleDatabaseError(error, "fetch", "research projects");
      }

      // Log the first project to debug
      if (data.length > 0) {
        console.log("First research project raw data:", {
          id: data[0].id,
          title: data[0].title,
          start_date: data[0].start_date,
          end_date: data[0].end_date,
          days_remaining: data[0].days_remaining,
        });
      }

      // Process the data to ensure consistent structure
      return data.map((project) => {
        // Use the existing fields directly from the database without recomputation
        // Provide camelCase versions for frontend compatibility
        return {
          ...project,
          // Add camelCase versions of snake_case fields
          startDate: project.start_date,
          endDate: project.end_date,
          daysRemaining: project.days_remaining,
          longDescription: project.long_description,
          nextMilestone: project.next_milestone,
          // Directly use existing columns - don't recalculate
          priority: project.priority,
          completion: project.completion,
          category: project.category,
          image_url: project.image_url,
          // Process related data
          tags: project.research_project_tags.map((tag: any) => tag.name),
          challenges: project.research_project_challenges,
          recentUpdates: project.research_project_updates.map(
            (update: any) => ({
              date: new Date(update.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              text: update.text,
            })
          ),
          teamMembers: project.research_project_team_members.map(
            (member: any) =>
              member.is_lead ? `${member.name} (Lead)` : member.name
          ),
          resources: project.research_project_resources,
        };
      });
    });
  } catch (error) {
    console.error("Error in getAllResearchProjects:", error);
    return [];
  }
}

// Get featured research projects
export async function getFeaturedResearchProjects(
  limit = 3
): Promise<ResearchProject[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Fetch featured research projects with related data
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
        .eq("featured", true)
        .eq("is_active", true)
        .order("priority", { ascending: true })
        .limit(limit);

      if (error) {
        throw handleDatabaseError(error, "fetch", "featured research projects");
      }

      // Process the data to ensure consistent structure
      return data.map((project) => {
        // Use existing columns directly - don't recalculate
        return {
          ...project,
          // Add camelCase versions for frontend compatibility
          startDate: project.start_date,
          endDate: project.end_date,
          daysRemaining: project.days_remaining,
          longDescription: project.long_description,
          nextMilestone: project.next_milestone,
          // Use existing columns directly
          priority: project.priority,
          completion: project.completion,
          category: project.category,
          image_url: project.image_url,
          // Process related data
          tags: project.research_project_tags.map((tag: any) => tag.name),
          challenges: project.research_project_challenges,
          recentUpdates: project.research_project_updates.map(
            (update: any) => ({
              date: new Date(update.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              text: update.text,
            })
          ),
          teamMembers: project.research_project_team_members.map(
            (member: any) =>
              member.is_lead ? `${member.name} (Lead)` : member.name
          ),
          resources: project.research_project_resources,
        };
      });
    });
  } catch (error) {
    console.error("Error in getFeaturedResearchProjects:", error);
    return [];
  }
}

// Get a single research project by ID
export async function getResearchProjectById(
  id: number
): Promise<ResearchProject | null> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

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
        .eq("id", id)
        .single();

      if (error) {
        throw handleDatabaseError(
          error,
          "fetch",
          `research project with ID ${id}`
        );
      }

      return {
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
    });
  } catch (error) {
    console.error(`Error in getResearchProjectById for ID ${id}:`, error);
    return null;
  }
}

// Create a new research project
export async function createResearchProject(
  project: Partial<ResearchProject>
): Promise<ResearchProject | null> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Insert the main project data
      const { data, error } = await supabase
        .from("research_projects")
        .insert([
          {
            title: project.title,
            slug: project.slug,
            description: project.description,
            long_description: project.longDescription,
            completion: project.completion || 0,
            start_date: project.startDate,
            end_date: project.endDate,
            days_remaining: project.daysRemaining,
            priority: project.priority || "medium",
            category: project.category,
            image_url: project.image_url,
            next_milestone: project.nextMilestone,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) {
        throw handleDatabaseError(error, "create", "research project");
      }

      const projectId = data.id;

      // Insert tags
      if (project.tags && project.tags.length > 0) {
        const tagData = project.tags.map((tag) => ({
          research_project_id: projectId,
          name: tag,
        }));

        await supabase.from("research_project_tags").insert(tagData);
      }

      // Insert challenges
      if (project.challenges && project.challenges.length > 0) {
        const challengeData = project.challenges.map((challenge) => ({
          research_project_id: projectId,
          description: challenge.description,
        }));

        await supabase
          .from("research_project_challenges")
          .insert(challengeData);
      }

      // Insert updates
      if (project.recentUpdates && project.recentUpdates.length > 0) {
        const updateData = project.recentUpdates.map((update) => ({
          research_project_id: projectId,
          date: new Date(update.date),
          text: update.text,
        }));

        await supabase.from("research_project_updates").insert(updateData);
      }

      // Insert team members
      if (project.teamMembers && project.teamMembers.length > 0) {
        const teamData = project.teamMembers.map((member) => {
          const isLead = member.includes("(Lead)");
          const name = isLead ? member.replace(" (Lead)", "") : member;

          return {
            research_project_id: projectId,
            name,
            is_lead: isLead,
          };
        });

        await supabase.from("research_project_team_members").insert(teamData);
      }

      // Insert resources
      if (project.resources && project.resources.length > 0) {
        const resourceData = project.resources.map((resource) => ({
          research_project_id: projectId,
          name: resource.name,
          url: resource.url,
        }));

        await supabase.from("research_project_resources").insert(resourceData);
      }

      // Return the complete project
      return getResearchProjectById(projectId);
    });
  } catch (error) {
    console.error("Error in createResearchProject:", error);
    return null;
  }
}

// Update an existing research project
export async function updateResearchProject(
  id: number,
  project: Partial<ResearchProject>
): Promise<ResearchProject | null> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Update the main project data
      const { error } = await supabase
        .from("research_projects")
        .update({
          title: project.title,
          slug: project.slug,
          description: project.description,
          long_description: project.longDescription,
          completion: project.completion,
          start_date: project.startDate,
          end_date: project.endDate,
          days_remaining: project.daysRemaining,
          priority: project.priority,
          category: project.category,
          image_url: project.image_url,
          next_milestone: project.nextMilestone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        throw handleDatabaseError(
          error,
          "update",
          `research project with ID ${id}`
        );
      }

      // Handle tags (delete and re-insert)
      if (project.tags) {
        // Delete existing tags
        await supabase
          .from("research_project_tags")
          .delete()
          .eq("research_project_id", id);

        // Insert new tags
        if (project.tags.length > 0) {
          const tagData = project.tags.map((tag) => ({
            research_project_id: id,
            name: tag,
          }));

          await supabase.from("research_project_tags").insert(tagData);
        }
      }

      // Handle challenges (delete and re-insert)
      if (project.challenges) {
        // Delete existing challenges
        await supabase
          .from("research_project_challenges")
          .delete()
          .eq("research_project_id", id);

        // Insert new challenges
        if (project.challenges.length > 0) {
          const challengeData = project.challenges.map((challenge) => ({
            research_project_id: id,
            description: challenge.description,
          }));

          await supabase
            .from("research_project_challenges")
            .insert(challengeData);
        }
      }

      // Handle updates (delete and re-insert)
      if (project.recentUpdates) {
        // Delete existing updates
        await supabase
          .from("research_project_updates")
          .delete()
          .eq("research_project_id", id);

        // Insert new updates
        if (project.recentUpdates.length > 0) {
          const updateData = project.recentUpdates.map((update) => ({
            research_project_id: id,
            date: new Date(update.date),
            text: update.text,
          }));

          await supabase.from("research_project_updates").insert(updateData);
        }
      }

      // Handle team members (delete and re-insert)
      if (project.teamMembers) {
        // Delete existing team members
        await supabase
          .from("research_project_team_members")
          .delete()
          .eq("research_project_id", id);

        // Insert new team members
        if (project.teamMembers.length > 0) {
          const teamData = project.teamMembers.map((member) => {
            const isLead = member.includes("(Lead)");
            const name = isLead ? member.replace(" (Lead)", "") : member;

            return {
              research_project_id: id,
              name,
              is_lead: isLead,
            };
          });

          await supabase.from("research_project_team_members").insert(teamData);
        }
      }

      // Handle resources (delete and re-insert)
      if (project.resources) {
        // Delete existing resources
        await supabase
          .from("research_project_resources")
          .delete()
          .eq("research_project_id", id);

        // Insert new resources
        if (project.resources.length > 0) {
          const resourceData = project.resources.map((resource) => ({
            research_project_id: id,
            name: resource.name,
            url: resource.url,
          }));

          await supabase
            .from("research_project_resources")
            .insert(resourceData);
        }
      }

      // Return the updated project
      return getResearchProjectById(id);
    });
  } catch (error) {
    console.error(`Error in updateResearchProject for ID ${id}:`, error);
    return null;
  }
}

// Delete a research project
export async function deleteResearchProject(id: number): Promise<boolean> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      const { error } = await supabase
        .from("research_projects")
        .delete()
        .eq("id", id);

      if (error) {
        throw handleDatabaseError(
          error,
          "delete",
          `research project with ID ${id}`
        );
      }

      return true;
    });
  } catch (error) {
    console.error(`Error in deleteResearchProject for ID ${id}:`, error);
    return false;
  }
}

// Move a research project to the projects table
export async function moveToProjects(id: number): Promise<boolean> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

      // Get the research project
      const researchProject = await getResearchProjectById(id);

      if (!researchProject) {
        throw new Error(`Research project with ID ${id} not found`);
      }

      // Create a new project in the projects table
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title: researchProject.title,
            slug: researchProject.slug,
            description: researchProject.description,
            detailed_description: researchProject.longDescription,
            completion: 100, // Set to 100% since it's completed
            start_date: researchProject.startDate,
            end_date:
              researchProject.endDate || new Date().toISOString().split("T")[0],
            priority: researchProject.priority,
            image_url: researchProject.image_url,
            technologies: researchProject.tags,
            key_achievements: researchProject.recentUpdates.map(
              (update) => update.text
            ),
            role:
              researchProject.teamMembers
                .find((member) => member.includes("(Lead)"))
                ?.replace(" (Lead)", "") || "Researcher",
          },
        ])
        .select()
        .single();

      if (error) {
        throw handleDatabaseError(
          error,
          "create",
          "project from research project"
        );
      }

      const projectId = data.id;

      // Add challenges as project challenges
      if (researchProject.challenges && researchProject.challenges.length > 0) {
        const challengeData = researchProject.challenges.map((challenge) => ({
          project_id: projectId,
          description: challenge.description,
        }));

        await supabase.from("project_challenges").insert(challengeData);
      }

      // Mark the research project as inactive
      await supabase
        .from("research_projects")
        .update({ is_active: false })
        .eq("id", id);

      return true;
    });
  } catch (error) {
    console.error(`Error in moveToProjects for ID ${id}:`, error);
    return false;
  }
}

// Get a research project by slug
export async function getResearchProjectBySlug(
  slug: string
): Promise<ResearchProject | null> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient();

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

      return {
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
    });
  } catch (error) {
    console.error(`Error in getResearchProjectBySlug for slug ${slug}:`, error);
    return null;
  }
}
