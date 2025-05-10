"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export async function revalidateContent(contentType: string) {
  try {
    // Revalidate the specific content type
    if (contentType === "all") {
      revalidatePath("/")
      revalidatePath("/projects")
      revalidatePath("/blog")
      revalidatePath("/research")
      revalidatePath("/skills")
      return { success: true, message: "All content revalidated successfully" }
    } else {
      revalidatePath(`/${contentType}`)
      revalidateTag(contentType)
      return { success: true, message: `${contentType} revalidated successfully` }
    }
  } catch (error) {
    console.error(`Error revalidating ${contentType}:`, error)
    return { success: false, message: `Failed to revalidate ${contentType}` }
  }
}
