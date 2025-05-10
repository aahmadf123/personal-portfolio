"use server"

import { revalidatePath } from "next/cache"
import { checkAuth, handleError, type ActionResponse } from "@/lib/server-action-utils"

export async function deleteCaseStudy(id: number): Promise<ActionResponse> {
  try {
    const { supabase } = await checkAuth()

    if (!id) {
      throw new Error("Case study ID is required", {
        cause: {
          code: "VALIDATION_ERROR",
          message: "Case study ID is required to delete a case study",
        },
      })
    }

    // Check if case study exists
    const { data: caseStudy, error: fetchError } = await supabase
      .from("case_studies")
      .select("id, title")
      .eq("id", id)
      .single()

    if (fetchError || !caseStudy) {
      throw new Error("Case study not found", {
        cause: {
          code: "NOT_FOUND",
          message: "The case study you're trying to delete could not be found",
        },
      })
    }

    // Delete related records if needed
    try {
      // Check if there's a case_study_tags table
      const { error: checkError } = await supabase.from("case_study_tags").select("id").limit(1)

      if (!checkError) {
        // If the table exists, delete related tags
        await supabase.from("case_study_tags").delete().eq("case_study_id", id)
      }
    } catch (relatedError) {
      console.error("Error checking/deleting related case study records:", relatedError)
      // Continue with case study deletion even if related records deletion fails
    }

    // Delete the case study
    const { error: deleteError } = await supabase.from("case_studies").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    revalidatePath("/admin/case-studies")

    return {
      success: true,
      message: `Case study "${caseStudy.title || ""}" deleted successfully`,
    }
  } catch (error) {
    return handleError(error)
  }
}
