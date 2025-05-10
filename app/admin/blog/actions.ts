"use server"

import { revalidatePath } from "next/cache"
import { checkAuth, handleError, type ActionResponse } from "@/lib/server-action-utils"

export async function deletePost(formData: FormData): Promise<ActionResponse> {
  try {
    const { supabase } = await checkAuth()

    const id = formData.get("id") as string

    if (!id) {
      throw new Error("Post ID is required", {
        cause: {
          code: "VALIDATION_ERROR",
          message: "Post ID is required to delete a post",
        },
      })
    }

    // Check if post exists
    const { data: post, error: fetchError } = await supabase.from("blog_posts").select("id").eq("id", id).single()

    if (fetchError || !post) {
      throw new Error("Post not found", {
        cause: {
          code: "NOT_FOUND",
          message: "The post you're trying to delete could not be found",
        },
      })
    }

    // First delete related records in a transaction
    const { error: deleteRelatedError } = await supabase.rpc("delete_post_related_records", { post_id: id })

    if (deleteRelatedError) {
      throw deleteRelatedError
    }

    // Then delete the post
    const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    revalidatePath("/admin/blog")

    return {
      success: true,
      message: "Post deleted successfully",
    }
  } catch (error) {
    return handleError(error)
  }
}
