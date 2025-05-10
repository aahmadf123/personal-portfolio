"use server"

import { revalidatePath } from "next/cache"
import { checkAuth, handleError, type ActionResponse } from "@/lib/server-action-utils"

export async function deleteSkill(id: number): Promise<ActionResponse> {
  try {
    const { supabase } = await checkAuth()

    if (!id) {
      throw new Error("Skill ID is required", {
        cause: {
          code: "VALIDATION_ERROR",
          message: "Skill ID is required to delete a skill",
        },
      })
    }

    // Check if skill exists
    const { data: skill, error: fetchError } = await supabase.from("skills").select("id, name").eq("id", id).single()

    if (fetchError || !skill) {
      throw new Error("Skill not found", {
        cause: {
          code: "NOT_FOUND",
          message: "The skill you're trying to delete could not be found",
        },
      })
    }

    // Check if skill is used in projects
    const { count: projectCount, error: countError } = await supabase
      .from("project_technologies")
      .select("*", { count: "exact", head: true })
      .eq("name", skill.name)

    if (!countError && projectCount && projectCount > 0) {
      throw new Error("Skill is in use", {
        cause: {
          code: "FOREIGN_KEY_VIOLATION",
          message: `This skill is used in ${projectCount} project(s) and cannot be deleted`,
        },
      })
    }

    // Delete the skill
    const { error: deleteError } = await supabase.from("skills").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    revalidatePath("/admin/skills")

    return {
      success: true,
      message: `Skill "${skill.name}" deleted successfully`,
    }
  } catch (error) {
    return handleError(error)
  }
}
