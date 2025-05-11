"use server"

import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function updatePost(postId: string, selectedTagIds: number[], formData: FormData) {
  const supabase = createClient()

  // Extract post data
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const published = formData.get("published") === "true"
  const category_id = Number.parseInt(formData.get("category_id") as string)
  const image_url = formData.get("image_url") as string
  const read_time = formData.get("read_time") as string

  // Update post
  await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt,
      content,
      published,
      category_id,
      image_url,
      read_time,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)

  // Handle tags
  const selectedTags = formData.getAll("tags") as string[]
  const selectedTagIdsNew = selectedTags.map(Number)

  // Delete removed tags
  await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", postId)
    .not("tag_id", "in", `(${selectedTagIdsNew.join(",")})`)

  // Add new tags
  const newTagIds = selectedTagIdsNew.filter((id) => !selectedTagIds.includes(id))
  if (newTagIds.length > 0) {
    const newPostTags = newTagIds.map((tag_id) => ({
      post_id: Number.parseInt(postId),
      tag_id,
    }))

    await supabase.from("post_tags").insert(newPostTags)
  }

  redirect("/admin/blog")
} 