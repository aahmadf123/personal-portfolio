"use server"

import { revalidatePath } from "next/cache"
import { checkAuth, handleError, type ActionResponse } from "@/lib/server-action-utils"

export async function deleteProject(formData: FormData): Promise<ActionResponse> {
  try {
    const { supabase } = await checkAuth()

    const id = formData.get("id") as string

    if (!id) {
      throw new Error("Project ID is required", {
        cause: {
          code: "VALIDATION_ERROR",
          message: "Project ID is required to delete a project",
        },
      })
    }

    // Check if project exists
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("id, title")
      .eq("id", id)
      .single()

    if (fetchError || !project) {
      throw new Error("Project not found", {
        cause: {
          code: "NOT_FOUND",
          message: "The project you're trying to delete could not be found",
        },
      })
    }

    // Delete related records in a transaction if possible, otherwise delete them one by one
    try {
      // Try to use a stored procedure if it exists
      const { error: deleteRelatedError } = await supabase.rpc("delete_project_related_records", { project_id: id })

      if (deleteRelatedError) {
        // If the RPC doesn't exist, delete records manually
        await supabase.from("project_tags").delete().eq("project_id", id)
        await supabase.from("project_technologies").delete().eq("project_id", id)
        await supabase.from("project_challenges").delete().eq("project_id", id)
        await supabase.from("project_milestones").delete().eq("project_id", id)
        await supabase.from("project_images").delete().eq("project_id", id)
      }
    } catch (relatedError) {
      console.error("Error deleting related project records:", relatedError)
      // Continue with project deletion even if related records deletion fails
    }

    // Delete the project
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    revalidatePath("/admin/projects")

    return {
      success: true,
      message: `Project "${project.title}" deleted successfully`,
    }
  } catch (error) {
    return handleError(error)
  }
}
