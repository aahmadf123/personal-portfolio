"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export async function revalidateProjects() {
  revalidatePath("/")
  revalidatePath("/projects")
  revalidateTag("projects")
  return { success: true, message: "Projects revalidated successfully" }
}

export async function revalidateBlog() {
  revalidatePath("/")
  revalidatePath("/blog")
  revalidateTag("blog")
  return { success: true, message: "Blog revalidated successfully" }
}

export async function revalidateSkills() {
  revalidatePath("/")
  revalidateTag("skills")
  return { success: true, message: "Skills revalidated successfully" }
}

export async function revalidateResearchProjects() {
  revalidatePath("/")
  revalidatePath("/research")
  revalidateTag("research")
  return { success: true, message: "Research projects revalidated successfully" }
}

export async function revalidateAll() {
  revalidatePath("/", "layout")
  revalidateTag("projects")
  revalidateTag("blog")
  revalidateTag("skills")
  revalidateTag("research")
  return { success: true, message: "All content revalidated successfully" }
}
